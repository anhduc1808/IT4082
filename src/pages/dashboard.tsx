import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { api } from "@/utils/api";
import {
  CardHeader,
  CardTitle,
  CardContent,
  Card,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecentPayments } from "@/components/page-component/dashboard/recent-payments";
import { DollarSign, User, BookX, LogOut } from "lucide-react";
import { format } from "date-fns";
import { Loading } from "@/components/common/loading";
import { Overview } from "@/components/page-component/dashboard/overview";
import UnpaidFeesModal from "@/components/page-component/dashboard/unpaid-fees-modal";
import BreadCrumb from "@/components/ui/breadcrumb";
import ResidentModal from "@/components/page-component/dashboard/resident-modal";

// ✅ Import kiểu Resident từ file types
import { type Resident } from "@/types/Resident";

const Dashboard = () => {
  const breadcrumbItems = [{ title: "", link: "" }];
  const [isUnpaidFeesModalOpen, setIsUnpaidFeesModalOpen] = useState(false);
  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);

  const {
    data: residentCount = 0,
    isLoading: isLoadingResidentCount,
    isError: isErrorResidentCount,
    error: errorResidentCount,
  } = api.resident.getCount.useQuery();

  const {
    data: totalContributionData,
    isLoading: isLoadingTotalContributionData,
    isError: isErrorTotalContributionData,
    error: errorTotalContributionData,
  } = api.fee.getTotalContributionFee.useQuery();

  const {
    currentMonthTotal = 0,
    percentageChange = 0,
    allTimeTotal = 0,
  } = totalContributionData || {};

  const {
    data: totalUnpaidFees,
    isLoading: isLoadingTotalUnpaidFees,
    isError: isErrorTotalUnpaidFees,
    error: errorTotalUnpaidFees,
  } = api.fee.getTotalUnpaidFees.useQuery();

  const {
    data: apartmentsWithUnpaidFees = [],
  } = api.fee.getUnpaidFees.useQuery();

  const {
    data: recentPayments,
    isLoading: isLoadingRecentPayments,
    isError: isErrorRecentPayments,
    error: errorRecentPayments,
  } = api.fee.getRecentPayments.useQuery();

  // ✅ Ép kiểu rõ ràng cho residentList
  const {
    data: residentList = [],
    isLoading: isLoadingResidentList,
    isError: isErrorResidentList,
    error: errorResidentList,
  } = api.resident.getAll.useQuery<Resident[]>();

  const handleViewUnpaidFees = () => {
    setIsUnpaidFeesModalOpen(true);
  };
  const handleViewResidents = () => {
    setIsResidentModalOpen(true);
  };

  // const handleLogout = async () => {
  //   await signOut({ callbackUrl: "/" });
  // };

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-4xl font-bold tracking-tight">Thông tin chung</h2>
          {/* <Button variant="destructive" onClick={() => void handleLogout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button> */}
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {/* Phí đóng góp */}
            <Card className="bg-card text-card-foreground border border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Phí đóng góp tháng {format(new Date(), "MM/yyyy")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingTotalContributionData ? (
                  <Loading />
                ) : isErrorTotalContributionData ? (
                  <div className="text-2xl font-bold text-destructive">
                    Error: {errorTotalContributionData.message}
                  </div>
                ) : (
                  <div className="text-2xl font-bold">
                    {currentMonthTotal.toLocaleString("vi-VN")}₫
                    <p className="text-xs font-normal text-muted-foreground">
                      {percentageChange >= 0 ? "+" : ""}
                      {percentageChange.toFixed(1)}% so với tháng trước
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                      Tổng phí đóng góp: {allTimeTotal.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Phí chưa thu */}
            <Card className="bg-card text-card-foreground border border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Phí chưa thu
                </CardTitle>
                <BookX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {isLoadingTotalUnpaidFees ? (
                    <Loading />
                  ) : isErrorTotalUnpaidFees ? (
                    <div className="text-2xl font-bold text-destructive">
                      Error: {errorTotalUnpaidFees.message}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">
                      {totalUnpaidFees
                        ? totalUnpaidFees.toLocaleString("vi-VN") + "₫"
                        : "Không có phí quá hạn"}
                    </div>
                  )}
                  <Button size="sm" onClick={handleViewUnpaidFees}>
                    Chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cư dân */}
            <Card className="bg-card text-card-foreground border border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Cư dân BlueMoon
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {isLoadingResidentCount ? (
                    <Loading />
                  ) : isErrorResidentCount ? (
                    <div className="text-2xl font-bold text-destructive">
                      Error: {errorResidentCount.message}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">{residentCount}</div>
                  )}
                  <Button size="sm" onClick={handleViewResidents}>
                    Chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3 bg-card text-card-foreground border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Thanh toán gần đây</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Chung cư BlueMoon có {recentPayments?.length || 0} thanh toán mới
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecentPayments ? (
                  <Loading />
                ) : isErrorRecentPayments ? (
                  <div className="text-2xl font-bold text-destructive">
                    Error: {errorRecentPayments.message}
                  </div>
                ) : (
                  <RecentPayments payments={recentPayments ?? []} />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-4 bg-card text-card-foreground border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Tổng quan</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal phí chưa thu */}
      <UnpaidFeesModal
        isOpen={isUnpaidFeesModalOpen}
        onClose={() => setIsUnpaidFeesModalOpen(false)}
        apartmentList={apartmentsWithUnpaidFees.map((apartment) => ({
          ...apartment,
          unpaidFees: apartment.unpaidFees || [],
        }))}
      />

      {/* Modal cư dân */}
      <ResidentModal
        isOpen={isResidentModalOpen}
        onClose={() => setIsResidentModalOpen(false)}
        residentList={residentList}
      />
    </div>
  );
};

export default Dashboard;
