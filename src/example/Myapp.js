import React from "react";
import "./MyappC.css";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import MockApi from "../utils/mockApi";
import ReactPaginate from "react-paginate";
import DataTable from "./DataTable";
import SettingTable from "./SettingTable";
import { CSVLink, CSVDownload } from "react-csv";

const mockApi = new MockApi();
const Myapp = () => {
  const [jsonData, setJsonData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [selection, setSelection] = useState([]);

  //컨텐츠설정 값들 가져오기 (자식->부모)
  //contentData 는 mySecObj와 동일하다
  const [contentData, setContentData] = useState("");

  //클릭한 값들 가져오기 (자식->부모)
  //clickedValue와 제목 비교해서 해당하는 객체 갖고오기
  //뒤에 띄어쓰기잘라야 값을 제대로 갖고옴
  const [clickedValue, setClickedValue] = useState("");

  var filteredTable = jsonData.filter(
    (n) => n.mailTitle === clickedValue.slice(0, -1)
  );
  var [myTable] = filteredTable;

  useEffect(() => {}, [selection]);

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await mockApi.get();
      setJsonData(response.data.articles);
      setTotalPages(Math.ceil(response.data.articles.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteData = async () => {
    try {
      const response = await mockApi.delete({
        mailUidList: parseInt(selection),
      });
      setJsonData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddData = async () => {
    try {
      const response = await mockApi.post(contentData);
      setJsonData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //업데이트(수정)
  const handleUpdateData = async () => {
    try {
      const response = await mockApi.put({
        ...contentData,
        mailUid: parseInt(selection),
      });
      setJsonData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const subset = jsonData.slice(startIndex, endIndex);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const headers = [
    {
      text: "NO",
      value: "mailUid",
    },
    {
      text: "유형",
      value: "mailType",
    },
    {
      text: "문서 제목",
      value: "mailTitle",
    },
    {
      text: "메일 사용 여부",
      value: "ismailIUse",
    },
    // {
    //   text: "수정일",
    //   value: "modificationDate",
    // },
  ];

  return (
    <div className="mydiv">
      <div className="content_list">
        <div className="grid_top">
          <div className="grid_icon">
            <Icon icon="ic:baseline-list-alt" />
            컨텐츠 목록
          </div>
          <div className="grid_button_section"></div>
        </div>
        <div className="grid">
          <div className="desc_btn">
            <div className="desc_btn_txt">
              <div className="reg_amount">
                <div className="reg_amount_now">
                  현재 등록: {jsonData.length}
                </div>
              </div>

              <div className="reg_amount_txt">등록된 전체 문서입니다</div>
            </div>
            <div className="desc_btn_btn">
              <button onClick={handleAddData}>등록하기</button>
              <button onClick={handleDeleteData}>삭제하기</button>
              <button onClick={handleUpdateData}>업데이트</button>
            </div>
          </div>
        </div>

        {/* 내용물 페이지 */}
        <div className="grid_content">
          <div className="grid_content_table">
            <DataTable
              headers={headers}
              items={subset}
              selectable={true}
              updateSelection={setSelection}
              setClickedValue={setClickedValue}
              myTable={myTable}
            />
          </div>
        </div>
        {/* 밑부분 페이지 */}
        <div className="page">
          <div className="page_icon_section">
            <div>
              <button className="excel_button">
                <CSVLink
                  data={jsonData}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Icon icon="ic:round-save-alt" className="page_icon" />
                  <span className="page_icon_txt">엑셀저장</span>
                </CSVLink>
              </button>
            </div>
            <div>
              <ReactPaginate
                containerClassName={"pagination"}
                activeClassName={"active"}
                pageClassName={"page-item"}
                breakLabel=". . ."
                nextLabel="next >"
                pageCount={totalPages}
                onPageChange={handlePageChange}
                previousLabel="< previous"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="content_setting">
        <div>
          <div className="grid_top">
            <div className="grid_icon_sec">컨텐츠 설정</div>
            <div className="grid_button_section">
              {/* <button className="grid_subtract_button">-</button> */}
            </div>
          </div>
          <div className="content_setting_content">
            <SettingTable
              length={jsonData.length}
              setContentData={setContentData}
              clickedValue={clickedValue}
              filteredTable={filteredTable}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Myapp;
