/**
 * 平台样式升级模块
 * 为游戏中的各类平台提供现代化的视觉效果
 */

// 导出优化后的平台绘制方法
export const PlatformStyles = {
  
  /**
   * 1. 普通平台 - 亮蓝色设计
   * 灵感：参考原设计高光色 #D3F8FF，使用亮蓝色系作为主体
   * 特点：亮蓝色渐变 + 原设计光影 + 纹理质感
   */
  drawNormalPlatform(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);
    
    // 主体 - 亮蓝色渐变
    const mainGradient = ctx.createLinearGradient(0, -height, 0, 0);
    mainGradient.addColorStop(0, '#7ec8f5');   // 顶部 - 亮蓝色
    mainGradient.addColorStop(0.3, '#6ab8eb'); // 中上 - 明亮蓝
    mainGradient.addColorStop(0.7, '#52a8e0'); // 中下 - 中亮蓝
    mainGradient.addColorStop(1, '#3d98d3');   // 底部 - 标准蓝
    
    ctx.fillStyle = mainGradient;
    ctx.fillRect(0, -height, width, height);
    
    // 顶部高光 - 明亮白蓝色
    ctx.fillStyle = '#d8f2ff';
    ctx.fillRect(0, -height, width, 2);
    
    // 左侧高光
    const leftGradient = ctx.createLinearGradient(0, 0, 3, 0);
    leftGradient.addColorStop(0, '#c5e9ff');
    leftGradient.addColorStop(1, 'rgba(197, 233, 255, 0)');
    ctx.fillStyle = leftGradient;
    ctx.fillRect(0, -height, 3, height);
    
    // 底部阴影 - 深蓝色
    ctx.fillStyle = '#1a4d6d';
    ctx.fillRect(0, -2, width, 2);
    
    // 右侧阴影
    const rightGradient = ctx.createLinearGradient(width - 3, 0, width, 0);
    rightGradient.addColorStop(0, 'rgba(26, 77, 109, 0)');
    rightGradient.addColorStop(1, '#1a4d6d');
    ctx.fillStyle = rightGradient;
    ctx.fillRect(width - 3, -height, 3, height);
    
    // 内部高光增强
    const topHighlight = ctx.createLinearGradient(0, -height + 2, 0, -height + 5);
    topHighlight.addColorStop(0, 'rgba(216, 242, 255, 0.7)');
    topHighlight.addColorStop(1, 'rgba(216, 242, 255, 0)');
    ctx.fillStyle = topHighlight;
    ctx.fillRect(2, -height + 2, width - 4, 3);
    
    // 内部阴影增强
    const bottomShadow = ctx.createLinearGradient(0, -5, 0, -2);
    bottomShadow.addColorStop(0, 'rgba(26, 77, 109, 0)');
    bottomShadow.addColorStop(1, 'rgba(26, 77, 109, 0.4)');
    ctx.fillStyle = bottomShadow;
    ctx.fillRect(2, -5, width - 4, 3);
    
    // 浅色纹理 - 增强立体感
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < width; i += 4) {
      for (let j = 0; j < height; j += 4) {
        if ((i + j) % 8 === 0) {
          ctx.fillRect(i, -height + j, 2, 2);
        }
      }
    }
    
    // 细微亮点纹理
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 2; i < width - 2; i += 3) {
      for (let j = -height + 2; j < -2; j += 3) {
        if (Math.random() > 0.7) {
          ctx.fillRect(i, j, 1, 1);
        }
      }
    }
    
    ctx.restore();
  },

  /**
   * 2. 弹簧平台 - 现代青绿色弹簧
   * 原：简单的绿色线条
   * 新：渐变弹簧 + 金属光泽 + 动态效果
   */
  drawSpringPlatform(ctx, x, y, width, height, springHeight, time) {
    ctx.save();
    ctx.translate(x, y);
    
    // 底座 - 深灰色渐变
    const baseGradient = ctx.createLinearGradient(0, -3, 0, 0);
    baseGradient.addColorStop(0, '#4b5563');
    baseGradient.addColorStop(1, '#374151');
    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, -3, width, 3);
    
    // 底座发光
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, -3, width, 3);
    
    // 顶盖 - 青绿色渐变
    const topGradient = ctx.createLinearGradient(0, -springHeight - 3, 0, -springHeight);
    topGradient.addColorStop(0, '#34d399');
    topGradient.addColorStop(1, '#10b981');
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, -springHeight - 3, width, 3);
    
    // 顶盖高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(0, -springHeight - 3, width, 1);
    
    // 顶盖发光边框
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, -springHeight - 3, width, 3);
    
    // 弹簧 - 金属螺旋效果
    const springCount = 4;
    const springWidth = (width - 20) / springCount;
    
    for (let i = 0; i < springCount; i++) {
      const sx = 10 + i * springWidth + springWidth / 2;
      
      // 弹簧线 - 渐变色
      const springGradient = ctx.createLinearGradient(
        sx, -springHeight, sx, -3
      );
      springGradient.addColorStop(0, '#6ee7b7');
      springGradient.addColorStop(0.5, '#34d399');
      springGradient.addColorStop(1, '#10b981');
      
      ctx.strokeStyle = springGradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      // 绘制螺旋弹簧
      ctx.beginPath();
      const segments = 8;
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const sy = -3 - (springHeight - 3) * t;
        const sway = Math.sin(t * Math.PI * 3) * 2;
        if (j === 0) {
          ctx.moveTo(sx + sway, sy);
        } else {
          ctx.lineTo(sx + sway, sy);
        }
      }
      ctx.stroke();
      
      // 高光
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    ctx.restore();
  },

  /**
   * 3. 传送带平台 - 科技感传送带
   * 原：复杂的灰色渐变
   * 新：深色金属 + 霓虹箭头 + 动态光效
   */
  drawConveyorPlatform(ctx, x, y, width, height, direction, offset, highlightIndex) {
    ctx.save();
    ctx.translate(x, y);
    
    // 主体 - 深色金属渐变
    const mainGradient = ctx.createLinearGradient(0, -height, 0, 0);
    mainGradient.addColorStop(0, '#1f2937');
    mainGradient.addColorStop(0.5, '#111827');
    mainGradient.addColorStop(1, '#0f1729');
    ctx.fillStyle = mainGradient;
    
    // 圆角矩形主体
    const radius = height * 0.4;
    ctx.beginPath();
    ctx.moveTo(radius, -height);
    ctx.lineTo(width - radius, -height);
    ctx.arcTo(width, -height, width, -height + radius, radius);
    ctx.lineTo(width, -radius);
    ctx.arcTo(width, 0, width - radius, 0, radius);
    ctx.lineTo(radius, 0);
    ctx.arcTo(0, 0, 0, -radius, radius);
    ctx.lineTo(0, -height + radius);
    ctx.arcTo(0, -height, radius, -height, radius);
    ctx.closePath();
    ctx.fill();
    
    // 边框发光
    ctx.strokeStyle = direction === 'left' ? '#8b5cf6' : '#ec4899';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 内部阴影
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 传送带纹理 - 动态线条
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.lineDashOffset = offset;
    
    ctx.beginPath();
    ctx.moveTo(10, -height + 3);
    ctx.lineTo(width - 10, -height + 3);
    ctx.stroke();
    
    ctx.lineDashOffset = -offset;
    ctx.beginPath();
    ctx.moveTo(10, -3);
    ctx.lineTo(width - 10, -3);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // 霓虹箭头
    const arrowCount = 4;
    const arrowSpacing = width * 0.7 / (arrowCount - 1);
    const startX = width * 0.15;
    
    for (let i = 0; i < arrowCount; i++) {
      const ax = direction === 'left' 
        ? startX + i * arrowSpacing 
        : width - startX - i * arrowSpacing;
      const highlighted = i === highlightIndex;
      const arrowColor = highlighted 
        ? (direction === 'left' ? '#a78bfa' : '#f472b6')
        : 'rgba(255, 255, 255, 0.3)';
      
      // 箭头发光效果
      if (highlighted) {
        ctx.shadowColor = arrowColor;
        ctx.shadowBlur = 8;
      }
      
      ctx.fillStyle = arrowColor;
      ctx.strokeStyle = arrowColor;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // 绘制箭头
      ctx.beginPath();
      const arrowDir = direction === 'left' ? -1 : 1;
      ctx.moveTo(ax, -height + 4);
      ctx.lineTo(ax + arrowDir * 5, -height / 2);
      ctx.lineTo(ax, -4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    }
    
    // 侧面滚轮效果
    const wheelRadius = radius - 1;
    [wheelRadius, width - wheelRadius].forEach(wx => {
      const wheelGradient = ctx.createRadialGradient(
        wx, -height / 2, 0, wx, -height / 2, wheelRadius
      );
      wheelGradient.addColorStop(0, '#4b5563');
      wheelGradient.addColorStop(0.7, '#374151');
      wheelGradient.addColorStop(1, '#1f2937');
      
      ctx.fillStyle = wheelGradient;
      ctx.beginPath();
      ctx.arc(wx, -height / 2, wheelRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    ctx.restore();
  },

  /**
   * 4. 尖刺平台 - 危险红色尖刺
   * 原：黑白渐变三角形
   * 新：红色危险尖刺 + 警告纹理 + 脉动效果
   */
  drawSpikePlatform(ctx, x, y, width, height, time) {
    ctx.save();
    ctx.translate(x, y);
    
    // 底座 - 警告条纹
    const stripeWidth = 8;
    for (let i = 0; i < width; i += stripeWidth * 2) {
      // 黄色警告条
      ctx.fillStyle = i % (stripeWidth * 4) === 0 ? '#fbbf24' : '#292524';
      ctx.fillRect(i, -height, Math.min(stripeWidth, width - i), height);
    }
    
    // 底座边框
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, -height, width, height);
    
    // 绘制尖刺
    const spikeWidth = 5;
    const spikeHeight = 12;
    const spikeSpacing = spikeWidth * 2;
    
    for (let i = 0; i < width; i += spikeSpacing) {
      const sx = i + spikeWidth / 2;
      
      // 尖刺渐变 - 红色危险色
      const spikeGradient = ctx.createLinearGradient(
        sx, -height, sx, -height - spikeHeight
      );
      spikeGradient.addColorStop(0, '#7f1d1d');
      spikeGradient.addColorStop(0.3, '#dc2626');
      spikeGradient.addColorStop(0.7, '#ef4444');
      spikeGradient.addColorStop(1, '#fca5a5');
      
      ctx.fillStyle = spikeGradient;
      
      // 绘制三角形尖刺
      ctx.beginPath();
      ctx.moveTo(sx - spikeWidth / 2, -height);
      ctx.lineTo(sx, -height - spikeHeight);
      ctx.lineTo(sx + spikeWidth / 2, -height);
      ctx.closePath();
      ctx.fill();
      
      // 尖刺边缘高光
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      // 尖刺阴影
      ctx.strokeStyle = 'rgba(127, 29, 29, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx + spikeWidth / 2, -height);
      ctx.lineTo(sx, -height - spikeHeight);
      ctx.stroke();
    }
    
    // 脉动警告光效（可选，基于time参数）
    if (time && Math.sin(time * 0.003) > 0.7) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(0, -height - spikeHeight, width, height + spikeHeight);
    }
    
    ctx.restore();
  },

  /**
   * 5. 假平台 - 虚幻紫色 + 翻滚动画
   * 原：灰色会消失
   * 新：半透明紫色 + 翻滚效果 + 破碎动画
   */
  drawFakePlatform(ctx, x, y, width, fullHeight, currentHeight, time) {
    ctx.save();
    ctx.translate(x, y);
    
    const heightRatio = currentHeight / fullHeight;
    const isDisappearing = heightRatio < 1;
    
    // 翻滚角度 - 根据消失程度旋转
    if (isDisappearing) {
      const rollAngle = (1 - heightRatio) * Math.PI; // 0 到 180度
      const centerX = width / 2;
      const centerY = -fullHeight / 2;
      
      ctx.translate(centerX, centerY);
      ctx.rotate(rollAngle);
      ctx.scale(1, heightRatio); // 垂直缩放
      ctx.translate(-centerX, -centerY);
    }
    
    // 主体颜色 - 半透明紫色渐变（更清晰可见）
    const mainGradient = ctx.createLinearGradient(0, -fullHeight, 0, 0);
    if (isDisappearing) {
      mainGradient.addColorStop(0, `rgba(167, 139, 250, ${heightRatio * 0.7})`);
      mainGradient.addColorStop(0.5, `rgba(139, 92, 246, ${heightRatio * 0.6})`);
      mainGradient.addColorStop(1, `rgba(124, 58, 237, ${heightRatio * 0.5})`);
    } else {
      // 正常状态 - 更清晰
      mainGradient.addColorStop(0, 'rgba(167, 139, 250, 0.7)');
      mainGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.6)');
      mainGradient.addColorStop(1, 'rgba(124, 58, 237, 0.5)');
    }
    
    ctx.fillStyle = mainGradient;
    ctx.fillRect(0, -fullHeight, width, fullHeight);
    
    // 边框 - 虚线表示虚幻
    ctx.strokeStyle = isDisappearing 
      ? `rgba(196, 181, 253, ${heightRatio * 0.8})`
      : 'rgba(196, 181, 253, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(0.75, -fullHeight + 0.75, width - 1.5, fullHeight - 1.5);
    ctx.setLineDash([]);
    
    // 内部纹理 - 格子图案
    if (!isDisappearing) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < width; i += 8) {
        for (let j = 0; j < fullHeight; j += 8) {
          if ((i + j) % 16 === 0) {
            ctx.fillRect(i, -fullHeight + j, 2, 2);
          }
        }
      }
    }
    
    // 扫描线效果
    if (!isDisappearing && time) {
      const scanProgress = (time * 0.003) % 1;
      const scanY = -fullHeight + scanProgress * fullHeight;
      
      const scanGradient = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
      scanGradient.addColorStop(0, 'rgba(196, 181, 253, 0)');
      scanGradient.addColorStop(0.5, 'rgba(196, 181, 253, 0.4)');
      scanGradient.addColorStop(1, 'rgba(196, 181, 253, 0)');
      
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 2, width, 4);
    }
    
    // 消失时的破碎效果
    if (isDisappearing && heightRatio < 0.6) {
      ctx.strokeStyle = `rgba(196, 181, 253, ${heightRatio})`;
      ctx.lineWidth = 1.5;
      
      // 裂纹效果
      for (let i = 0; i < 6; i++) {
        const cx = Math.random() * width;
        const cy = -Math.random() * fullHeight;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + (Math.random() - 0.5) * 20, cy + Math.random() * 12);
        ctx.stroke();
      }
      
      // 破碎粒子
      ctx.fillStyle = `rgba(196, 181, 253, ${heightRatio * 0.7})`;
      for (let i = 0; i < 10; i++) {
        const px = Math.random() * width;
        const py = -Math.random() * fullHeight;
        const size = 1 + Math.random() * 2;
        ctx.fillRect(px, py, size, size);
      }
    }
    
    // 闪烁警告
    if (!isDisappearing && time && Math.sin(time * 0.005) > 0.6) {
      ctx.fillStyle = 'rgba(196, 181, 253, 0.4)';
      ctx.fillRect(0, -fullHeight, width, 2);
    }
    
    ctx.restore();
  }
};

// 导出常量
export const PLATFORM_COLORS = {
  NORMAL: { primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd' },
  SPRING: { primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7' },
  CONVEYOR_LEFT: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd' },
  CONVEYOR_RIGHT: { primary: '#ec4899', secondary: '#f472b6', accent: '#fbcfe8' },
  SPIKE: { primary: '#dc2626', secondary: '#ef4444', accent: '#fca5a5' },
  FAKE: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd' }
};

