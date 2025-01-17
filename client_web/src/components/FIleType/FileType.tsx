import React from 'react';
import { BiSolidFilePng, BiSolidFileJpg } from "react-icons/bi";
import { FaFilePdf } from "react-icons/fa";
import { SiJpeg } from "react-icons/si";
import { AiOutlineFileExcel } from "react-icons/ai";
import { RiFileWord2Line, RiFileWordLine } from "react-icons/ri";

const FileIcon: React.FC<{ fileUrl: string; onClick: () => void; }> = ({ fileUrl, onClick }) => {
    const handleClick = () => {
        onClick();
    };

    const renderFile = () => {
        if (fileUrl.endsWith('.png')) {
            return <BiSolidFilePng style={{ width: "3em", height: "3em", color: "pink" }} />;
        } else if (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg')) {
            return <BiSolidFileJpg style={{ width: "3em", height: "3em", color: "orange" }} />;
        } else if (fileUrl.endsWith('.pdf')) {
            return <FaFilePdf style={{ width: "3em", height: "3em", color: "red" }} />;
        } else if (fileUrl.endsWith('.PDF')) {
            return <FaFilePdf style={{ width: "3em", height: "3em", color: "red" }} />;
        } else if (fileUrl.endsWith('.jpeg')) {
            return <SiJpeg style={{ width: "3em", height: "3em", color: "orange" }} />;
        } else if (fileUrl.endsWith('.xlsx') || fileUrl.endsWith('.xls')) {
            return <AiOutlineFileExcel style={{ width: "3em", height: "3em", color: "green" }} />;
        } else if (fileUrl.endsWith('.docx')) {
            return <RiFileWord2Line style={{ width: "3em", height: "3em", color: "blue" }} />;
        } else if (fileUrl.endsWith('.doc')) {
            return <RiFileWordLine style={{ width: "3em", height: "3em", color: "blue" }} />;
        } else {
            return null; // You can add more conditions or return a default icon for other file types
        }
    };

    return (
        <div onClick={handleClick}>
            {renderFile()}
        </div>
    );
};

export default FileIcon;
