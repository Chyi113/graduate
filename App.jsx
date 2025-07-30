import React, { useEffect, useState } from 'react';
import TreemapChart from './treemap';
import axios from 'axios';


function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/d3').then((res) => {
      const rawData = res.data;

      // 🔽 這裡加入排序與行列計算邏輯
      const dataSorted = rawData
        .slice()
        .sort((a, b) => (b.vote_like + b.vote_love) - (a.vote_like + a.vote_love));

      const rows = Math.ceil(Math.sqrt(dataSorted.length));
      const cols = Math.ceil(dataSorted.length / rows);

      setData(dataSorted);
    });
  }, []);

  return (
    <div>
      <h2>景點投票 Treemap</h2>
      <p>資料筆數：{data.length} 筆</p>
      <TreemapChart data={data} />
    </div>
  );
}

export default App;
