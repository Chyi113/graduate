import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TreemapChart = ({ data, width = 900, height = 500 }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const root = d3.hierarchy({
      name: 'root',
      children: data
        .slice()
        .sort((a, b) => (b.vote_like + b.vote_love) - (a.vote_like + a.vote_love))
        .map(d => ({
          name: d.name_zh || d.name,
          vote_like: d.vote_like,
          vote_love: d.vote_love,
          category: d.category,
          photo: d.photo,
          who_like: d.who_like,
          who_love: d.who_love,
          value: Math.max(1, d.vote_like + d.vote_love),
        })),
    }).sum(d => d.value);

    const treemapLayout = d3.treemap()
      .tile(d3.treemapSquarify.ratio(1))
      .size([width, height])
      .padding(10);

    treemapLayout(root);

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    // 類別對應顏色
    const categoryColors = {
      'History & Religion': '#fae588',
      'Art & Museums': '#cfe1b9',
      'Scenic Spots': '#669bbc',
      'Transport Rides': '#f25c54',
      default: '#ccc'
    };


    const nodes = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x0}, ${d.y0})`)
      .attr('class', 'hoverable')  // ✅ 加上這個
      .style("cursor", "pointer");

    // 背景底色（分類顏色）
    nodes.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => categoryColors[d.data.category] || categoryColors.default)
      .attr('opacity', 0.7)
      .attr('stroke', 'none'); // 不能顯示明顯邊框


    // 加上照片疊在底色上
    nodes.append('image')
      .attr('href', d => d.data.photo)  // 確保你的 data 有 photo 欄位
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('opacity', 0.7)  // 調整照片透明度，露出底色


    nodes.append('text')
      .attr('x', 5)
      .attr('y', 18)
      .text(d => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        return w > 60 && h > 30 ? d.data.name : '';
      })
      .attr('font-size', '12px')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none');

    const overlay = nodes.append('g')
      .attr('class', 'overlay-info')
      .style('display', 'none'); // 初始隱藏

    // 半透明黑底框
    overlay.append('rect')
      .attr('width', d => d.x1 - d.x0 - 10)
      .attr('height', 50)
      .attr('x', 5)
      .attr('y', 22)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', 'rgba(0,0,0,0.6)');

    // 顯示資料文字：like, love, who
    overlay.append('text')
      .attr('x', 10)
      .attr('y', 38)
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .text(d => `👍 ${d.data.vote_like}  ❤️ ${d.data.vote_love}  👥 ${
        (d.data.who_like?.length || 0) + (d.data.who_love?.length || 0)
      }`);

    overlay.append('text')
      .attr('x', 10)
      .attr('y', 58)
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .text(d => `👍 by: ${(d.data.who_like || []).join(', ')}`);

    overlay.append('text')
      .attr('x', 10)
      .attr('y', 73)
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .text(d => `❤️ by: ${(d.data.who_love || []).join(', ')}`);
    

    nodes
      .on('mouseenter', function (event, d) {
        // 先全部變暗
        nodes.transition().duration(100).style("opacity", 0.3);

        const boxWidth = d.x1 - d.x0;
        const boxHeight = d.y1 - d.y0;
        const scaleFactor = 1.3;
        const margin = 10; // ✅ 安全邊距

        const scaledWidth = boxWidth * scaleFactor;
        const scaledHeight = boxHeight * scaleFactor;

        // 預設以中心放大後的左上角位置
        let dx = d.x0 - (scaledWidth - boxWidth) / 2;
        let dy = d.y0 - (scaledHeight - boxHeight) / 2;

        // ✅ 邊界檢查 + 加入 margin 限制
        if (dx < margin) dx = margin;
        if (dx + scaledWidth > width - margin) dx = width - margin - scaledWidth;
        if (dy < margin) dy = margin;
        if (dy + scaledHeight > height - margin) dy = height - margin - scaledHeight;

        // ✅ 套用動畫
        d3.select(this)
          .raise()
          .transition()
          .duration(200)
          .attr("transform", `translate(${dx},${dy}) scale(${scaleFactor})`);



        // 顯示圖片和 overlay
        d3.select(this).select('image')
          .transition().duration(200)
          .attr('opacity', 1);

        d3.select(this).select('.overlay-info')
          .style('display', 'block');
      })
      .on('mouseleave', function (event, d) {
        // 還原所有格子的透明度與大小
        nodes.transition().duration(100)
          .style("opacity", 1)
          .attr("transform", d => `translate(${d.x0},${d.y0})`);

        // 隱藏 overlay & 還原圖片透明度
        d3.select(this).select('image')
          .transition().duration(200)
          .attr('opacity', 0.7);

        d3.select(this).select('.overlay-info')
          .style('display', 'none');
      });


    // 定義一組 SVG <defs> 動態漸層
    const defs = svg.append('defs');

    data.forEach((d, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', 'gradient-border-' + i)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

      let startColor = '#fae588';
      let endColor = '#f25c54';

      // 根據分類給不同的漸層顏色
      switch (d.category) {
        case 'Art & Museums':
          startColor = '#ffdfba';
          endColor = '#ffb3ba';
          break;
        case 'Scenic Spots':
          startColor = '#bae1ff';
          endColor = '#baffc9';
          break;
        case 'Transport Rides':
          startColor = '#f9a1bc';
          endColor = '#fbc4ab';
          break;
        case 'History & Religion':
          startColor = '#dcd6f7';
          endColor = '#a6b1e1';
          break;
        default:
          startColor = '#ddd';
          endColor = '#aaa';
      }

      gradient.selectAll('stop')
        .data([
          { offset: '0%', color: startColor },
          { offset: '100%', color: endColor }
        ])
        .enter()
        .append('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color);
    });


    // 新增邊框的 rect（比圖片整體大一點）
    nodes.append('rect')
      .attr('class', 'animated-border')
      .attr('x', -3)
      .attr('y', -3)
      .attr('width', d => d.x1 - d.x0 + 6)
      .attr('height', d => d.y1 - d.y0 + 6)
      .attr('fill', 'none')
      .attr('stroke-width', 3.8)
      .attr('stroke', (d, i) => `url(#gradient-border-${i})`) // 套用對應漸層
      //.attr('stroke-opacity', 0.8)
      .lower(); // 放到最底層，避免蓋到內容

        // 加入動畫函式
    function animateGradient(i) {
      const grad = d3.select(`#gradient-border-${i}`);
      let angle = 0;
      function frame() {
        angle = (angle + 2) % 360;
        grad
          .attr('x2', `${Math.cos(angle * Math.PI / 180) * 100 + 50}%`)
          .attr('y2', `${Math.sin(angle * Math.PI / 180) * 100 + 50}%`);
        requestAnimationFrame(frame);
      }
      frame();
    }

    // 呼叫每個 gradient 的動畫
    data.forEach((d, i) => animateGradient(i));

  }, [data, width, height]);

  return <svg ref={ref} width={width} height={height}></svg>;
};

export default TreemapChart;
