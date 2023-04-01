import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context";
import HINDI from "./../assets/hindi.png";
import ENGLISH from "./../assets/english.png";
import { MdRefresh, MdOutlineFileDownload } from "react-icons/md";
import html2canvas from "html2canvas";

const DownloadPoster = () => {
  const { docInfo, setLoading } = useContext(AppContext);
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
        const link = document.createElement("a");
        link.href = myImage;
        link.target = "_blank";
        link.setAttribute("download", "image.jpeg");
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        alert("oops, something went wrong!", error);
      });
  };
  return (
    <>
      <div className="py-4">
        <div id="fullImg" className="w-[320px] shadow-xl relative">
          <img src={docInfo?.poster_language === "hindi" ? HINDI : ENGLISH} />
          <div className="px-8 w-full absolute bottom-12 py-3">
            <div className="bg-white py-2 rounded-3xl relative pl-[70px] border border-gray-200 shadow-lg">
              <div className="w-16 h-16 border-2 border-[#065b33] rounded-full absolute left-0 top-[50%] translate-y-[-50%] overflow-hidden">
                <img src={docInfo?.photo} alt="user" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold leading-4">
                  {docInfo?.doc_name}
                </div>
                <div className="text-xs">{docInfo?.doc_contact}</div>
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
      </div>
    </>
  );
};
export default DownloadPoster;
