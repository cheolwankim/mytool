import { useState } from "react";
import "./table.css";

import Modal from "react-modal";
// 여기는 return

export default function DataTable({
  headers,
  items = [], // items props 받기, default parameter 빈 배열로 설정
  selectable = false, // selectable props 받기
  itemKey, // itemKey props 받기
  updateSelection, // updateSelection props 받기
  setClickedValue,
  myTable,
}) {
  if (!headers || !headers.length) {
    throw new Error("<DataTable /> headers is required.");
  }
  // value 순서에 맞게 테이블 데이터를 출력하기 위한 배열
  const headerKey = headers.map((header) => header.value);
  // itemKey가 없다면 headers의 첫번째 요소를 선택
  if (!itemKey) {
    itemKey = headerKey[0];
  }
  // 선택한 row의 itemKey를 담은 배열
  const [selection, setSelection] = useState(new Set());

  const onChangeSelect = (value) => {
    // 기존의 selection으로 새로운 Set 생성
    const newSelection = new Set(selection);
    if (newSelection.has(value)) {
      // value가 있으면 삭제 (checked가 false이기 때문)
      newSelection.delete(value);
    } else {
      // value가 없으면 추가 (checked가 true이기 때문)
      newSelection.add(value);
    }
    // 새로운 Set으로 state 변경
    setSelection(newSelection);
    updateSelection([...newSelection]);
  };

  const onChangeSelectAll = (e) => {
    if (e.target.checked) {
      // checked가 true인 경우 전체 선택
      const allCheckedSelection = new Set(
        // 활성화된 행의 배열을 순회하며 itemKey로 요소에 접근해 데이터를 저장
        getAbledItems(items).map((item) => item[itemKey])
      );
      setSelection(allCheckedSelection);
      updateSelection([...allCheckedSelection]);
    } else {
      // checked가 false인 경우 전체 선택 해제
      setSelection(new Set());
      updateSelection([]);
    }
  };
  const getAbledItems = (items) => {
    return items.filter(({ disabled }) => !disabled);
  };
  const isSelectedAll = () => {
    return selection.size === getAbledItems(items).length;
  };

  // 클릭시 데이터보내기
  const [targetValue, setTargetValue] = useState("");
  const onClickEvent = (e) => {
    if (e.target.innerHTML.length > 4) {
      setTargetValue(e.target.innerHTML);
      setClickedValue(e.target.innerHTML);
      setIsOpen(true);
    }
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
          {myTable ? (
            <div>
              <h1>{myTable.mailTitle}</h1>
              <div>
                <h2>{myTable.mailType}</h2>                
                <h2> {myTable.mailContent}</h2>
                <div>
                  <h3>변경사유: {myTable.reason}</h3>
                  <h3>메일사용여부: {myTable.ismailIUse}</h3>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </Modal>
      </div>
      <div>
        <table className="myTable">
          <thead>
            <tr>
              {selectable && (
                <th>
                  <input
                    type="checkbox"
                    checked={isSelectedAll()}
                    onChange={onChangeSelectAll}
                  />
                </th>
              )}
              {headers.map((header) => (
                <th key={header.text}>
                  {header.text} {/* 컬럼명 바인딩 */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className={`
                ${selection.has(item[itemKey]) ? "select_row" : ""} 
                ${item.disabled ? "disabled_row" : ""}
              `}
              >
                {/* headerKey를 순회하면서 key를 가져옴 */}
                {selectable && (
                  <td className="select_column">
                    <input
                      type="checkbox"
                      disabled={item.disabled}
                      checked={selection.has(item[itemKey])}
                      onChange={() => onChangeSelect(item[itemKey])}
                    />
                  </td>
                )}
                {headerKey.map((key) => (
                  <td key={key + index} onClick={onClickEvent}>
                    {item[key]} {/* key로 객체의 값을 출력 */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
