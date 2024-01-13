import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
import "./SettingTable.css";

export default function SettingTable({
  length,
  setContentData,
  clickedValue,
  filteredTable,
}) {
  const [inputStatus, setInputStatus] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [myReason, setMyReason] = useState("");
  const [quilValue, setQuilValue] = useState("");

  //mydata = fiteredTable에서 옵션제거함
  const [mydata] = filteredTable;

  const handleClickRadioButton = (radioBtnName) => {
    setInputStatus(radioBtnName);
  };

  // 기존obj 형식
  const [myObj, setMyObj] = useState({
    mailUid: "",
    mailType: "",
    mailTitle: "",
    ismailIUse: "",
    modificationDate: "",
    mailContent: "",
    reason: "",
  });

  // 날짜
  var today = new Date();

  var year = today.getFullYear();
  var month = ("0" + (today.getMonth() + 1)).slice(-2);
  var day = ("0" + today.getDate()).slice(-2);
  var hours = ("0" + today.getHours()).slice(-2);
  var minutes = ("0" + today.getMinutes()).slice(-2);

  var dateString = year + "-" + month + "-" + day;
  var timeString = hours + ":" + minutes;
  var time = dateString + " " + timeString;

  // mailTitle
  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  // mailType
  const onChangeType = (e) => {
    setType(e.target.value);
  };

  // mailType
  const onChangeReason = (e) => {
    setMyReason(e.target.value);
  };

  // 저장하기
  // mysecObj = 입력받은거 저장됨
  const onSave = () => {
    const mySecObj = {
      mailUid: length + 1,
      mailType: type,
      mailTitle: title,
      ismailIUse: inputStatus,
      modificationDate: time,
      mailContent: quilValue, // quill에서 값 가져옴
      reason: myReason,
    };
    setMyObj(mySecObj);
    setContentData(mySecObj);
    alert("저장됨");
  };

  // 모달창
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  Modal.setAppElement("#root");

  const customStyles = {
    content: {
      right: "40%",
      bottom: "auto",
      transform: "translate(35%, 70%)",
    },
  };

  return (
    <>
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          {myObj ? (
            <div>
              <h1>{myObj.mailTitle}</h1>
              <div>
                <h2>{myObj.mailType}</h2>
                <h2> {myObj.mailContent}</h2>
                <div>
                  <h3>변경사유: {myObj.reason}</h3>
                  <h3>메일사용여부: {myObj.ismailIUse}</h3>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </Modal>

        <table border="1px">
          <tbody>
            <tr>
              <td className="myTd">문서유형</td>
              <td>
                <input
                  id="input_mailType"
                  type="text"
                  value={type}
                  onChange={onChangeType}
                  placeholder="메일유형을 입력해주세요"
                />
              </td>
              <td className="myTd">메일 사용여부</td>
              <td>
                {/* 추후 value 이용 */}
                <input
                  type="radio"
                  id="Y"
                  checked={inputStatus === "Y"}
                  onClick={() => handleClickRadioButton("Y")}
                  readOnly
                />
                사용
                <input
                  type="radio"
                  id="N"
                  checked={inputStatus === "N"}
                  onClick={() => handleClickRadioButton("N")}
                  readOnly
                />
                미사용
              </td>
            </tr>
            <tr>
              <td className="myTd">문서 발송 제목</td>
              <td colSpan={3}>
                <input
                  width="100%"
                  id="input_mailTitle"
                  value={title}
                  onChange={onChangeTitle}
                  placeholder="제목: 3글자 이상 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td width="150" height={550} className="myTd">
                문서 내용
              </td>
              <td colSpan={3}>
                <div>
                  <ReactQuill
                    theme="snow"
                    value={quilValue}
                    onChange={setQuilValue}
                    style={{
                      width: "900px",
                      height: "500px",
                      margin: "0 0 50px 0px",
                    }}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="myTd"> 변경사유</td>
              <td colSpan={3}>
                <input
                  id="input_reason"
                  value={myReason}
                  onChange={onChangeReason}
                  placeholder="변경사유를 입력해주세요"
                />
              </td>
            </tr>
            <tr>
              <td className="myTr" colSpan={4}>
                <button className="content_button" onClick={onSave}>
                  저장하기
                </button>
                <button className="content_button" onClick={openModal}>
                  미리보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
