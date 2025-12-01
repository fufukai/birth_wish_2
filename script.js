/* ====================
   1. 基础逻辑
   ==================== */
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const startMask = document.getElementById('startMask');
const startBtn = document.getElementById('startBtn');

// 解决音乐自动播放限制，并在点击“开始”后初始化 Swiper
startBtn.addEventListener('click', () => {
    // 播放音乐
    audio.play().then(() => {
        musicBtn.classList.remove('stopped');
        musicBtn.style.animation = "bgMove 3s linear infinite"; // 简单的旋转动画
    }).catch(e => {
        console.log("Audio play failed (interaction needed)", e);
    });

    // 隐藏遮罩
    startMask.style.opacity = '0';
    setTimeout(() => {
        startMask.style.display = 'none';
        // 初始化 Swiper
        initSwiper();
    }, 600);
});

// 音乐按钮点击暂停/播放
musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // 防止触发翻页
    if (audio.paused) {
        audio.play();
        musicBtn.classList.remove('stopped');
        musicBtn.style.animation = "bgMove 3s linear infinite";
    } else {
        audio.pause();
        musicBtn.classList.add('stopped');
        musicBtn.style.animation = "none";
    }
});

/* ====================
   2. Swiper 设置 (修复点击翻页)
   ==================== */
var swiper; // 全局变量

function initSwiper() {
    swiper = new Swiper(".mySwiper", {
        direction: "vertical",
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false, // 去掉阴影会让页面更干净
        },
        speed: 800, // 翻页速度慢一点更优雅
        on: {
            // 点击页面任意空白处翻下一页
            click: function (s, e) {
                // 如果点击的是音乐按钮，不翻页 (虽然后面stopProp了，双重保险)
                if (e.target.closest('#musicBtn')) return;
                
                // 翻到下一页
                s.slideNext();
                
                // 生成一个花瓣
                createPetal(e.pageX, e.pageY);
            }
        }
    });
}

/* ====================
   3. 点击/触摸生成纯花瓣特效
   ==================== */
// 只保留花瓣符号
const flowerEmojis = ['🌸', '🌺', '🌷', '🏵️','🎂','🎈','🎉']; 

function createPetal(x, y) {
    const petal = document.createElement('div');
    
    // 随机选一个花
    const emoji = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
    
    petal.innerText = emoji;
    petal.className = 'petal';
    
    // 设置位置
    petal.style.left = x + 'px';
    petal.style.top = y + 'px';
    
    // 随机大小和旋转
    const size = Math.random() * 20 + 15; // 15-35px
    petal.style.fontSize = size + 'px';
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // 设置动画时长
    const duration = Math.random() * 1 + 1; // 1-2秒
    petal.style.animationDuration = duration + 's';
    
    document.body.appendChild(petal);

    // 动画结束后移除
    setTimeout(() => {
        petal.remove();
    }, duration * 1000);
}

// 监听全局点击 (不仅是 Swiper 内部，以防万一)
document.addEventListener('click', (e) => {
    // 排除按钮点击，避免逻辑冲突
    if(e.target.id === 'startBtn' || e.target.closest('#musicBtn')) return;
    
    createPetal(e.clientX, e.clientY);
});


/* ====================
   4. 倒计时逻辑 (已改为：距离未来某天的倒计时)
   ==================== */
// !!! 请在这里设置生日的具体时间 (年-月-日T时:分:秒)
// 注意：如果今年的生日已经过了，记得把年份改成明年，否则会显示全是0
const targetDate = new Date('2026-12-03T00:00:00'); 

function updateTimer() {
    const now = new Date();
    
    // 计算差距：目标时间 - 当前时间
    let diff = targetDate - now;

    // 如果时间已经到了（也就是diff小于等于0），显示 00:00:00
    if (diff <= 0) {
        diff = 0;
        // 可选：倒计时结束时把上面的标题改了
        const title = document.querySelector('.content-box.layout-end h2');
        if(title) title.innerText = "生日快乐！！！"; 
        
        const subText = document.querySelector('.content-box.layout-end > p'); // 选择直属的p
        if(subText) subText.innerText = "愿你年年皆胜意，岁岁都欢愉 ✨";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 更新页面数字
    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}

setInterval(updateTimer, 1000);
updateTimer();