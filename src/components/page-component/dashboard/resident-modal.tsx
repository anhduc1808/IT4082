import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Loading } from "@/components/common/loading";
import { type Resident } from "@/types/Resident";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  residentList: Resident[];
  isLoading?: boolean;
  error?: Error;
}

const ResidentModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  residentList = [],
  isLoading,
  error,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isOpen) setCurrentPage(0);
  }, [isOpen]);

  const totalPages = Math.ceil(residentList.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const selectedResidents = residentList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thông tin cư dân</DialogTitle>
          <DialogDescription>Danh sách các cư dân trong hệ thống</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-6 text-center">
            <Loading />
          </div>
        ) : error ? (
          <div className="py-6 text-center text-red-500">
            Lỗi: {error.message}
          </div>
        ) : residentList.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            Không có cư dân nào trong hệ thống.
          </div>
        ) : (
          <>
            <Accordion type="multiple">
              {selectedResidents.map((resident) => (
                <AccordionItem key={resident.id} value={resident.id}>
                  <AccordionTrigger>{resident.name}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Số điện thoại: {resident.phoneNumber || "Không có"}</li>
                      <li>Số căn hộ: {resident.address?.apartmentNo ?? "Không có"}</li>
                      <li>Phương tiện: {resident.vehicle || "Không có"}</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {totalPages > 1 && (
              <div className="flex justify-end items-center pt-6 space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(0)}
                  disabled={currentPage === 0}
                >
                  <DoubleArrowLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {currentPage + 1}/{totalPages}
                </span>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  <DoubleArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        <div className="flex w-full justify-end pt-6">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResidentModal;
