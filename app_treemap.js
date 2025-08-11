import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TreemapChart = ({ data, width = 900, height = 500, onRefresh }) => {
  function createIconButton(group, x, emoji, onClickHandler, isActive, fallbackEmoji = '❓', forceBlack = false) {
    const buttonGroup = group.append('g')
      .attr('transform', `translate(${x}, 0)`)
      .style('cursor', 'pointer')
      .on('click', onClickHandler);

    // 固定白色邊框
    const strokeColor = '#fff';

    // ✅ 背景填色（黑或白）
    const fillColor = forceBlack ? 'black' : (isActive ? '#fff' : 'black');

    // 外圓圈底
    buttonGroup.append('circle')
      .attr('r', 14)
      .attr('fill', fillColor)
      .attr('opacity', 1)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2);

    // 判斷 emoji 是圖片網址還是文字
    if (emoji.startsWith('http')) {
      const image = buttonGroup.append('image')
        .attr('href', emoji)
        .attr('x', -10)
        .attr('y', -10)
        .attr('width', 20)
        .attr('height', 20);

      const fallback = buttonGroup.append('text')
        .attr('class', 'fallback-emoji')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '16px')
        .attr('fill', isActive ? 'black' : 'white')
        .attr('opacity', 0)
        .text(fallbackEmoji);

      image.node().addEventListener('error', () => {
        image.remove();
        fallback.attr('opacity', 1);
      });
    } else {
      buttonGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '16px')
        .attr('fill', isActive ? 'black' : 'white')
        .text(emoji);
    }
  }


  function sendVoteToBackend(t_id, a_id, user_id, type, callback) {
    console.log('🧪 投票送出資料：', {
      t_id,
      a_id,
      user_id,
      type
    });

    const url = 'http://localhost:3001/api/switchvote';
    const payload = JSON.stringify({ t_id, a_id, user_id, type });

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })
      .then(async res => {
        const parseResponseJson = async () => {
          try {
            return await res.json();
          } catch {
            return null;
          }
        };

        const result = await parseResponseJson();

        if (!res.ok) {
          const errMsg = result?.error || '操作失敗';
          alert(errMsg);
          return;
        }

        console.log(`${type} 操作成功：`, result);
        if (callback) callback(result); // ✅ 把回傳的 JSON 傳進來
      })
      .catch(err => {
        console.error('送出錯誤:', err);
        alert('無法送出請求');
      });
  }







  const ref = useRef();
  useEffect(() => {
    if (!data || data.length === 0) return;

    const root = d3.hierarchy({
      name: 'root',
      children: data
        .slice()
        .sort((a, b) => {
          const aTotal = a.vote_like + a.vote_love;
          const bTotal = b.vote_like + b.vote_love;

          if (aTotal !== bTotal) {
            return bTotal - aTotal; // 比總票數
          } else {
            return b.vote_love - a.vote_love; // 同票數時，愛心多的排前面
          }
        })

        .map(d => ({
          a_id: d.a_id, 
          t_id: d.t_id,
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
      .padding(2);

    treemapLayout(root);

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const nodes = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x0}, ${d.y0})`)
      .attr('class', 'hoverable')

    // 加上照片疊在底色上
    nodes.each(function (d) {
      const group = d3.select(this);
      const img = group.append('image')
        .attr('href', d.data.photo)
        .attr('width', d.x1 - d.x0)
        .attr('height', d.y1 - d.y0)
        .attr('preserveAspectRatio', 'xMidYMid slice')
        .attr('opacity', 0.8);

      img.node().addEventListener('error', function () {
        img.attr('href', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUZnZYwmGHr3G3y3kkZVcPc7LqkPQ8hxXeXuhIUmDcR4OujR_KuDWMhL9xZcpyUfVpkA0oLmiYXe4wDB5_LbFaLfTs5pZADkq_dMfcGeUcET3u-rId8JWe549FBKlWJq6KjvXlLpV_osMx/s180-c/odekake_umi.png');
      });
    });



    // 先畫書籤背景（在下層）
    nodes.append('rect')
      .attr('class', 'label-background')
      .attr('x', 0)
      .attr('y', 6)
      .attr('width', d => {
        const name = d.data.name;
        const fontSize = 12;
        return Math.min((name.length + 2) * fontSize * 0.9, d.x1 - d.x0 - 3);
      })
      .attr('height', 16)
      .attr('fill', (d, i) => `url(#gradient-border-${i})`)
      .attr('opacity', 0.85);

    // 再畫文字（在上層）
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



    nodes
      .on('mouseenter', function (event, d) {
        d3.select(this).raise();
        const thisNode = d3.select(this);

        // 還原除了當前之外的所有格子
        nodes.each(function (nodeDatum) {
          if (nodeDatum !== d) {
            d3.select(this)
              .transition()
              .duration(100)
              .style("opacity", 0.3)
              .attr("transform", `translate(${nodeDatum.x0},${nodeDatum.y0}) scale(1)`);
          }
        });

        const boxWidth = d.x1 - d.x0;
        const boxHeight = d.y1 - d.y0;
        const scaleFactor = 1.3;
        const margin = 10;

        const scaledWidth = boxWidth * scaleFactor;
        const scaledHeight = boxHeight * scaleFactor;

        let dx = d.x0 - (scaledWidth - boxWidth) / 2;
        let dy = d.y0 - (scaledHeight - boxHeight) / 2;

        if (dx < margin) dx = margin;
        if (dx + scaledWidth > width - margin) dx = width - margin - scaledWidth;
        if (dy < margin) dy = margin;
        if (dy + scaledHeight > height - margin) dy = height - margin - scaledHeight;

        // 只有目前 node 做放大與資訊顯示
        thisNode
          .raise()
          .transition()
          .duration(200)
          .attr("transform", `translate(${dx},${dy}) scale(${scaleFactor})`)
          .style("opacity", 1);

        thisNode.select('image')
          .transition().duration(200)
          .attr('opacity', 1);

        thisNode.select('.overlay-info')
          .style('display', 'block');

        const rectWidth = d.x1 - d.x0;
        const rectHeight = d.y1 - d.y0;

        // 動態計算左邊的距離
        let leftOffset = rectWidth * 0.2;
        if (leftOffset >= 30) leftOffset = 20;
        if (leftOffset <= 5) leftOffset = 15;
        if (rectWidth <= 70) leftOffset = rectWidth * 0.25;
        if (rectWidth >= 100 && rectWidth < 150)
          leftOffset = rectWidth * 0.16;

        // 距離底部的高度
        let bottomOffset = rectHeight * 0.1;
        if (rectHeight >= 100 && rectHeight < 200) bottomOffset = rectHeight * 0.13;
        if (rectHeight <= 100) bottomOffset = rectHeight * 0.2;
        if (bottomOffset >= 20) bottomOffset = 20;
        

        const hoverGroup = thisNode.append('g')
          .attr('class', 'hover-buttons')
          .attr('transform', `translate(${leftOffset}, ${rectHeight - bottomOffset})`);


        const user_id = 'AAA';
        const liked = d.data.who_like.includes(user_id);
        const loved = d.data.who_love.includes(user_id);

        // 😀 like 按鈕
        createIconButton(
          hoverGroup,
          0,
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYi8pOHIrRfNwCLIxIvaPLqOLr2F4KCqZhptxeW_1YKY3FJ9hNrgdr8MX00uFcbvXLcJP05LhN8nfZUXtv8-4ZXQet-HwF4JmLj97-HjYzTg1swTfNeVhbWwlWG3pNWmOMdRc4g6NtJ9FX/s1600/mark_face_smile.png',
          function () {
            sendVoteToBackend(d.data.t_id, d.data.a_id, user_id, 'like', (res) => {
              if (res.action === 'removed') {
                // 使用者已點過 like，這次是取消
                d.data.who_like = [];
              } else if (res.action === 'switched') {
                // 使用者從 heart 切換成 like
                d.data.who_like = [user_id];
                d.data.who_love = [];
              }
              if (onRefresh) onRefresh();  // 重新渲染圖表，建議要有
            });
          },
          liked,    // 是否已按過 like，控制樣式
          '😀'      // fallback emoji
        );


        // 😍 heart 按鈕
        createIconButton(
          hoverGroup,
          32,  // x 座標偏移，讓按鈕不重疊
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4527o0Xycu0v0Plvi-VwxKuzrg1YXjZ9AAnRDROfCpYh4LZ4SKhVC0nhDPXIpV5EA5Ha5cVHGhH6A1otPLlJecR0qKwh5Tswqidt1kbMF2tUy3rT3cWXF-OpWKndUN22CkkSE63jNzsLe/s1600/mark_face_laugh.png',
          function () {
            sendVoteToBackend(d.data.t_id, d.data.a_id, user_id, 'heart', (res) => {
              if (res.action === 'removed') {
                // 使用者已點過 heart，這次是取消
                d.data.who_love = [];
              } else if (res.action === 'switched') {
                // 使用者從 like 切換成 heart
                d.data.who_love = [user_id];
                d.data.who_like = [];
              }
              if (onRefresh) onRefresh();  // 更新畫面，建議保留
            });
          },
          loved,   // 是否已按過 heart，控制按鈕樣式
          '😍'     // fallback emoji
        );



        let isEyeOpen = false; // 👁️ 記錄目前是否已開啟 overlay

        // ⬇️ 建立眼睛按鈕（初始強制黑底）
        const eyeBtn = createIconButton(
          hoverGroup,
          rectWidth - 40,
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEidUxRG8FVurhwqDWSGumS2AUFtPOXvNMarEuaMeMZZ-2QvQy1HriKlmhWE-tvJtJmb2dtt5Z-2CsuZWxlkg0skCpOAYTyR_YxSNn2sX-7koaPXUZBWiG2GgK6ZNr5t-qR0zQZqepKoh0I/s800/mark_manpu12_hirameki.png',
          function () {
            const eyeGroup = d3.select(this);
            const existing = thisNode.select('.overlay-info');

            if (!existing.empty()) {
              // 🔴 關閉 overlay
              existing.remove();
              isEyeOpen = false;

              eyeGroup.select('circle')
                .attr('fill', 'black')
                .attr('stroke', '#ddd');
              return;
            }

            // ✅ 開啟 overlay
            isEyeOpen = true;

            eyeGroup.select('circle')
              .attr('fill', '#fff')
              .attr('stroke', '#ddd');

            const overlayWidth = rectWidth;
            let overlayHeight = 65;
            let isCollapsed = false;
            let currentOverlayY = rectHeight - 103;

            const overlay = thisNode.append('g')
              .attr('class', 'overlay-info')
              .attr('transform', `translate(0, ${currentOverlayY})`)
              .call(d3.drag().on('drag', dragged))
              .raise();

            const overlayBg = overlay.append('rect')
              .attr('width', overlayWidth)
              .attr('height', overlayHeight)
              .attr('fill', '#e9ecef')
              .attr('opacity', 0.85);

            const infoGroup = overlay.append('g').attr('class', 'info-content');

            function drawInfoContent() {
              infoGroup.selectAll('*').remove();
              if (isCollapsed) {
                overlayHeight = 28;
                infoGroup.append('text')
                  .attr('x', 10)
                  .attr('y', 20)
                  .attr('fill', 'black')
                  .attr('font-size', '11px')
                  .text(`👍 ${d.data.vote_like}  ❤️ ${d.data.vote_love}`);
              } else {
                overlayHeight = 65;
                infoGroup.append('text')
                  .attr('x', 10)
                  .attr('y', 20)
                  .attr('fill', 'black')
                  .attr('font-size', '11px')
                  .text(`👍 ${d.data.vote_like}  ❤️ ${d.data.vote_love}`);

                infoGroup.append('text')
                  .attr('x', 10)
                  .attr('y', 38)
                  .attr('fill', 'black')
                  .attr('font-size', '10px')
                  .text(`👍：${(d.data.who_like || []).join(', ') || '無'}`);

                infoGroup.append('text')
                  .attr('x', 10)
                  .attr('y', 55)
                  .attr('fill', 'black')
                  .attr('font-size', '10px')
                  .text(`❤️：${(d.data.who_love || []).join(', ') || '無'}`);
              }

              overlayBg.attr('height', overlayHeight);
            }

            drawInfoContent();

            const toggleBtn = overlay.append('g')
              .attr('class', 'toggle-btn')
              .attr('transform', `translate(${overlayWidth - 20}, 15)`)
              .on('click', () => {
                isCollapsed = !isCollapsed;
                drawInfoContent();
              });

            toggleBtn.append('circle')
              .attr('r', 9)
              .attr('fill', '#dee2e6')
              .attr('stroke', '#6c757d')
              .attr('stroke-width', 0.5);

            toggleBtn.append('text')
              .attr('text-anchor', 'middle')
              .attr('alignment-baseline', 'middle')
              .attr('font-size', '10px')
              .attr('fill', '#495057')
              .text('⎘');

            function dragged(event) {
              currentOverlayY += event.dy;

              const minY = rectHeight - 103;
              const maxY = isCollapsed ? rectHeight * 0.72 : rectHeight * 0.57;

              currentOverlayY = Math.max(minY, Math.min(maxY, currentOverlayY));
              overlay.attr('transform', `translate(0, ${currentOverlayY})`);
            }
          },
          false,  // 初始不是 active
          '👁️',   // fallback emoji
          true    // 強制黑底
        );








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

        d3.select(this).select('.hover-buttons').remove();
        d3.select(this).select('.overlay-info').remove();
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
        case 'Culture & Heritage':
          startColor = '#ffdfba';
          endColor = '#ffbf69';
          break;
        case 'Scenic Spots':
          startColor = '#bae1ff';
          endColor = '#baffc9';
          break;
        case 'Transport Rides':
          startColor = '#f9a1bc';
          endColor = '#fbc4ab';
          break;
        case 'Discovery Spaces':
          startColor = '#dcd6f7';
          endColor = '#a6b1e1';
          break;
        case 'Public Squares':
          startColor = '#c77dff';
          endColor = '#ffd6ff';
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
