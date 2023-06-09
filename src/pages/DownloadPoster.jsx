import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context";
import templates from "./../lib/templates";
import download from "downloadjs";
import axios from "axios";
import {
  MdRefresh,
  MdOutlineFileDownload,
  MdPictureAsPdf,
} from "react-icons/md";
import html2canvas from "html2canvas";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const DownloadPoster = () => {
  const { user, docInfo, setLoading, selectedPoster } = useContext(AppContext);
  let myPdf;
  if (selectedPoster) {
    myPdf = `templates/${selectedPoster.poster_path}/${
      docInfo?.poster_language === "english" ? "english.pdf" : "hindi.pdf"
    }`;
  }

  const navigate = useNavigate();
  useEffect(() => {
    if (!docInfo) {
      navigate("/");
    }
  }, [docInfo]);
  const reloadPage = () => {
    window.location.reload();
  };

  const downloadImage = () => {
    setLoading(true);
    window.scrollTo(0, 0);
    html2canvas(document.getElementById("fullImg"), {
      allowTaint: true,
      useCORS: true,
      logging: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      onrendered: function (canvas) {
        document.body.appendChild(canvas);
        window.scrollTo(0, 0);
      },
    })
      .then((canvas) => {
        var myImage = canvas.toDataURL("image/jpeg", 1);
        uploadData(myImage);
        // const link = document.createElement("a");
        // link.href = myImage;
        // link.target = "_blank";
        // link.setAttribute("download", "image.jpeg");
        // document.body.appendChild(link);
        // link.click();
        // setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        alert("oops, something went wrong!", error);
      });
  };
  const uploadData = async (img) => {
    const data = {
      emp_id: user?.emp_id,
      emp_name: user?.emp_name,
      region: user?.region,
      hq: user?.hq,
      doc_name: docInfo?.doc_name,
      doc_contact: "-",
      poster_name: selectedPoster?.poster_name,
      template: img,
    };
    console.log(data);

    await axios
      .post("insert.php", data)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          const link = document.createElement("a");
          link.href = `https://zyduscustomizedposter.in/${response.data.path}`;
          link.target = "_blank";
          link.setAttribute("download", "image.jpeg");
          document.body.appendChild(link);
          link.click();
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  function roundedImage(ctx) {
    ctx.beginPath();
    ctx.arc(512 / 2, 512 / 2, 512 / 2, 0, Math.PI * 2, false);
  }

  const downloadPDF = async () => {
    let pdfPhoto = "";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "";
    img.src = docInfo?.photo;
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      roundedImage(ctx, 0, 0, 512, 512, 512 / 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, 512, 512);
      pdfPhoto = canvas.toDataURL("image/png");
    };
    const existingPdfBytes = await fetch(myPdf).then((res) =>
      res.arrayBuffer()
    );
    const pngImageBytes = await fetch(pdfPhoto).then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    firstPage.drawText(docInfo?.doc_name, {
      x: 200,
      y: 155,
      size: 22,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    // firstPage.drawText(docInfo?.doc_contact.toString(), {
    //   x: 200,
    //   y: 140,
    //   size: 20,
    //   font: helveticaNormal,
    //   color: rgb(0, 0, 0),
    // });
    firstPage.drawImage(pngImage, {
      // x: 63,
      x: 64,
      y: 105,
      // y: 107,
      width: 115,
      height: 115,
    });
    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, `pdf.pdf`, "application/pdf");
  };
  return (
    <>
      <div className="py-4">
        <div id="fullImg" className="w-[320px] shadow-xl relative">
          <img
            src={`templates/${selectedPoster?.poster_path}/${
              docInfo?.poster_language === "english"
                ? "english.png"
                : "hindi.png"
            }`}
          />
          {/* with contact */}
          {/* <div className="px-8 w-full absolute bottom-12 py-3">
            <div className="bg-white py-2 rounded-3xl relative pl-[70px] border border-gray-200 shadow-lg">
              <div className="w-16 h-16 border-2 border-gray-200 rounded-full absolute left-[-2px] top-[50%] translate-y-[-50%] overflow-hidden">
                <img src={docInfo?.photo} alt="user" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold leading-4">
                  {docInfo?.doc_name}
                </div>
                <div className="text-xs">{docInfo?.doc_contact}</div>
              </div>
            </div>
          </div> */}
          <div className="px-8 w-full absolute bottom-14 py-3">
            <div className="bg-white py-4 rounded-3xl relative pl-[70px] border border-gray-200 shadow-lg">
              <div className="w-16 h-16 border-2 border-gray-200 rounded-full absolute left-[-2px] top-[50%] translate-y-[-50%] overflow-hidden">
                <img src={docInfo?.photo} alt="user" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[14px] font-semibold leading-4">
                  {docInfo?.doc_name}
                </div>
                {/* <div className="text-xs">{docInfo?.doc_contact}</div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="actionBtns">
        <button onClick={reloadPage}>
          <MdRefresh />
        </button>
        <button onClick={downloadImage}>
          <MdOutlineFileDownload />
        </button>
        <button onClick={downloadPDF}>
          <MdPictureAsPdf />
        </button>
      </div>
    </>
  );
};
export default DownloadPoster;
