import React, { useEffect, useState } from "react";
import MockApi from "../utils/mockApi";
const mockApi = new MockApi();

const Myexample = () => {
  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await mockApi.get();
      setJsonData(response.data.articles);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteData = async () => {
    try {
      const response = await mockApi.delete({ mailUidList: 1 });
      setJsonData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddData = async () => {
    try {
      const response = await mockApi.post({
        mailType: "New Type",
        mailTitle: "New Title",
        ismailIUse: "Yes",
        mailContent: "New Content",
        reason: "New Reason",
      });
      setJsonData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateData = async () => {
    try {
      const response = await mockApi.put({
        mailUid: 1,
        mailType: "Updated Type",
        mailTitle: "Updated Title",
        ismailIUse: "Yes",
        mailContent: "Updated Content",
        reason: "Updated Reason",
      });
      setJsonData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <section>
        <h2>GetExample</h2>

        <ul>
          {jsonData.map((item) => (
            <li key={item.mailUid}>
              <strong>{item.mailTitle}</strong> - {item.mailContent}
              {item.modificationDate}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>DeleteExample</h2>
        <button onClick={handleDeleteData}>Delete Data</button>
      </section>
      <section>
        <h2>PostExample</h2>
        <button onClick={handleAddData}>Add Data</button>
      </section>
      <section>
        <h2>PutExample</h2>
        <button onClick={handleUpdateData}>Update Data</button>
      </section>
    </div>
  );
};
export default Myexample;
