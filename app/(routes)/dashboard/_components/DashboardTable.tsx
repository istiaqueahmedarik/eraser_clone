"use client";

import React, { use, useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Archive, Delete, MoreHorizontal } from "lucide-react";
import { FileListContext } from "@/app/_context/FileListContext";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export interface FILE {
  _id: string;
  fileName: string;
  createdBy: string;
  _creationTime: string;
  archieved: boolean;
  teamId: string;
  document: string;
  whiteboard: string;
}

const DashboardTable = () => {
  const { fileList, setFileList } = useContext(FileListContext);
  const [fileList_, setFileList_] = useState([] as FILE[]);
  const { user } = useKindeBrowserClient();
  const deleteFileMutation = useMutation(api.files.deleteFile);

  useEffect(() => {
    fileList && setFileList_(fileList);
    console.log(fileList);
  }, [fileList]);

  const handleArchive = (id: string) => {
    console.log("archived", id);
  };

  const handleDelete = (id: string) => {
    deleteFileMutation({ _id: id as any })
      .then(() => {
        // Remove the deleted file from the file list
        const updatedList = fileList_.filter(file => file._id !== id);
        setFileList_(updatedList);
        setFileList && setFileList(updatedList);
        toast.success("File deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete file");
      });
  };

  const router = useRouter();

  return (
    <div className="mt-8 pl-2 pr-2">
      <Table className="border-none ">
        <TableHeader className="">
          <TableRow className="border-white/40 mx-16 hover:bg-transparent">
            <TableHead className="pl-20 w-[300px]">Name</TableHead>
            <TableHead className="">Location</TableHead>
            <TableHead className="">Author</TableHead>
            <TableHead className="pr-2 w-[100px]">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fileList_ &&
            fileList_.map((file) => (
              <TableRow
                key={file._id}
                onClick={() => {
                  router.push(`/workspace/${file._id}`);
                }}
                className="cursor-pointer border-white/40 group px-2 hover:bg-white/5"
              >
                <TableCell className="font-medium pl-20">
                  {file.fileName}
                </TableCell>
                <TableCell className=""></TableCell>
                <TableCell className="w-[150px] text-sm">
                  <div>
                    <img
                      src={
                        user?.picture ??
                        "https://img.freepik.com/free-vector/graphic-designer-man_78370-159.jpg?size=626&ext=jpg&ga=GA1.1.1395880969.1709251200&semt=ais"
                      }
                      alt="logo"
                      className="w-8 h-8 rounded-full object-cover cursor-pointer"
                    />
                  </div>
                </TableCell>
                <TableCell className="w-[150px] text-sm">
                  {moment(file._creationTime).format("DD MMM YYYY")}
                </TableCell>
                <TableCell className="text-right align-middle pr-4" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="outline-none">
                      <div className="p-1 hover:bg-neutral-600 w-fit rounded-sm cursor-pointer">
                        <MoreHorizontal size={16} />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-neutral-800 gap-1 rounded-lg text-white border-neutral-700 w-48 ml-4 mt-2">
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-neutral-700 focus:text-white"
                        onClick={() => {
                          handleArchive(file._id);
                        }}
                      >
                        <Archive size={16} className="mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-red-500 focus:text-white hover:bg-red-500 hover:text-white"
                        onClick={() => {
                          handleDelete(file._id);
                        }}
                      >
                        <Delete size={16} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardTable;
