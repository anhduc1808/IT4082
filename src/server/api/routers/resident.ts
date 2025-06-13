import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { residentFormSchema, updateResidentFormSchema } from "@/lib/validators";
import { format } from "date-fns";

export const residentRouter = createTRPCRouter({
  // Lấy danh sách cư dân
  getAll: publicProcedure.query(async ({ ctx }) => {
    const residents = await ctx.prisma.resident.findMany({
      orderBy: { createAt: "desc" },
      include: {
        address: {
          include: {
            apartment: true,
            dateRanges: true,
          },
        },
      },
    });

    return residents.map((item) => ({
      id: item.id,
      name: item.name,
      nationalId: item.nationalId,
      phoneNumber: item.phoneNumber,
      gender: item.gender,
      vehicle: item.vehicle,
      createAt: format(item.createAt, "dd/MM/yyyy"),
      updateAt: format(item.updateAt, "dd/MM/yyyy"),
      address: {
        permanentAddress: item.address.permanentAddress,
        currentAddress: item.address.currentAddress,
        isStaying: item.address.isStaying ? "Đang cư trú" : "Tạm vắng",
        apartmentNo: item.address.apartment.apartmentNo,
        dateRanges: item.address.dateRanges.map((range) => ({
          startDate: format(range.startDate, "dd/MM/yyyy"),
          endDate: format(range.endDate, "dd/MM/yyyy"),
          type: range.type,
        })),
      },
    }));
  }),

  // Lấy cư dân theo ID
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.resident.findUnique({
      where: { id: input },
      include: {
        address: {
          include: {
            apartment: true,
            dateRanges: true,
          },
        },
      },
    });
  }),

  // Tạo cư dân mới
  create: publicProcedure.input(residentFormSchema).mutation(async ({ ctx, input }) => {
    const { address } = input;

    // Kiểm tra căn hộ
    if (!address || !address.apartmentNo) {
      throw new Error("Căn hộ này không tồn tại");
    }

    const apartmentExists = await ctx.prisma.apartment.findUnique({
      where: { apartmentNo: address.apartmentNo },
    });

    if (!apartmentExists) {
      throw new Error("Căn hộ này không tồn tại");
    }

    const newAddress = await ctx.prisma.address.create({
      data: {
        permanentAddress: address.permanentAddress,
        currentAddress: address.currentAddress,
        isStaying: address.isStaying,
        apartmentNo: address.apartmentNo,
        dateRanges:
          address.startDate && address.endDate
            ? {
                create: [
                  {
                    startDate: address.startDate,
                    endDate: address.endDate,
                    type: "Thời gian tạm vắng",
                  },
                ],
              }
            : undefined,
      },
    });

    const newResident = await ctx.prisma.resident.create({
      data: {
        name: input.name,
        nationalId: input.nationalId,
        phoneNumber: input.phoneNumber,
        gender: input.gender,
        vehicle: input.vehicle,
        addressId: newAddress.id,
      },
    });

    return newResident;
  }),

  // Cập nhật cư dân
  update: publicProcedure.input(updateResidentFormSchema).mutation(async ({ ctx, input }) => {
    const { address, isStayingChangedToTrue } = input;

    const apartmentExists = await ctx.prisma.apartment.findUnique({
      where: { apartmentNo: address.apartmentNo },
    });

    if (!apartmentExists) {
      throw new Error("Căn hộ này không tồn tại");
    }

    const updatedAddress = await ctx.prisma.address.update({
      where: { id: input.addressId },
      data: {
        permanentAddress: address.permanentAddress,
        currentAddress: address.currentAddress,
        isStaying: address.isStaying,
        apartmentNo: address.apartmentNo,
      },
    });

    if (isStayingChangedToTrue) {
      // Nếu chuyển từ "tạm vắng" sang "đang cư trú", xoá mọi thời gian tạm vắng
      await ctx.prisma.dateRange.deleteMany({
        where: { addressId: updatedAddress.id },
      });
    } else if (address.startDate && address.endDate) {
      // Nếu vẫn là tạm vắng thì cập nhật hoặc tạo mới
      const existingDateRange = await ctx.prisma.dateRange.findFirst({
        where: { addressId: updatedAddress.id },
      });

      if (existingDateRange) {
        await ctx.prisma.dateRange.update({
          where: { id: existingDateRange.id },
          data: {
            startDate: address.startDate,
            endDate: address.endDate,
            type: "Thời gian tạm vắng",
          },
        });
      } else {
        await ctx.prisma.dateRange.create({
          data: {
            startDate: address.startDate,
            endDate: address.endDate,
            type: "Thời gian tạm vắng",
            addressId: updatedAddress.id,
          },
        });
      }
    }

    return ctx.prisma.resident.update({
      where: { id: input.id },
      data: {
        name: input.name,
        nationalId: input.nationalId,
        phoneNumber: input.phoneNumber,
        gender: input.gender,
        vehicle: input.vehicle,
        addressId: updatedAddress.id,
      },
    });
  }),

  // Xoá cư dân
  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.resident.delete({ where: { id: input } });
  }),

  // Đếm số cư dân
  getCount: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.resident.count();
  }),

  // Lấy danh sách căn hộ đang có cư dân cư trú
  getOccupiedApartments: publicProcedure.query(async ({ ctx }) => {
    const occupiedApartments = await ctx.prisma.apartment.findMany({
      where: {
        addresses: {
          some: {
            isStaying: true,
            resident: {
              isNot: null,
            },
          },
        },
      },
      include: {
        addresses: {
          where: {
            isStaying: true,
            resident: {
              isNot: null,
            },
          },
          include: {
            resident: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
                vehicle: true,
              },
            },
          },
        },
      },
    });

    const apartments = occupiedApartments.map((apartment) => ({
      apartmentNo: apartment.apartmentNo,
      residents: apartment.addresses.map((address) => ({
        id: address.resident?.id || "",
        name: address.resident?.name || "Unknown",
        phoneNumber: address.resident?.phoneNumber || "",
        vehicle: address.resident?.vehicle || "",
        apartmentNo: apartment.apartmentNo,
      })),
    }));

    return {
      apartments,
      count: apartments.length,
    };
  }),
});

export default residentRouter;
