// 사용자 하드 코딩 영역
const TYPOON_NAME = "YAGI"; //태풍 이름
const TYPOON_SEQ = 10; //태풍 발생 호
const TYPOON_TIME = 202409070000; //태풍 발표 시각
// 사용자 하드 코딩 영역

const UTC_TIME = 9 * 60 * 60 * 1000;

let currentTimeInterval = null;
let currentScreenIndex = 1;
let currentRightSrc = "";
let selectedTime = null;
let currentTime = new Date();
let isPlaying = false;

const $slideDate = document.querySelector("#slideDate");
const $screenLeft = document.querySelector("#screenLeft img");
const $screenRight = document.querySelector("#screenRight img");

const $datePicker = document.querySelector("#datePicker");
const $timeSlider = document.querySelector("#timeSlider");

const baseImages = {
  //화면 1 ~ 4
  screen1_left_default: `https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?tm={T1}&cmp=HSP&qcd=HSO&obs=ECHD&map=HC&size=800&xp=-9999&yp=-9999&zoom=1&wv=00&ht=1500&color=C4&topo=1&ZRa=&ZRb=&lat=&lon=&lonlat=0&x1=&y1=&x2=&y2=&center=0&typ=0&aws=01&wt=0`,
  screen1_right_default: `https://afso.kma.go.kr/cgi/rdr/nph-rdr_cmp1_img?tm={T1}&cmp=HSP&qcd=HSLP&obs=ECHD&color=C4&aws=0&acc=0&map=HC&grid=2&legend=1&size=700&itv=5&zoom_level=1&zoom_x=3350000&zoom_y=5120000&gov=`,

  screen2_left_default: `https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?tm={T1}&cmp=HSP&qcd=HSO&obs=ECHD&map=HC&size=800&xp=-9999&yp=-9999&zoom=1&wv=00&ht=1500&color=C4&topo=1&ZRa=&ZRb=&lat=&lon=&lonlat=0&x1=&y1=&x2=&y2=&center=0&typ=0&aws=01&wt=0`,
  screen2_right_default: `https://nmsc.kma.go.kr/IMG/GK2A/AMI/PRIMARY/L1B/COMPLETE/KO/{T3}/gk2a_ami_le1b_rgb-s-daynight_ko020lc_{T2}.png`,

  screen3_left_default: `https://radar.kma.go.kr/cgi-bin/center/nph-rdr_cmp_img?tm={T1}&cmp=HSP&qcd=HSO&obs=ECHD&map=HC&size=800&xp=-9999&yp=-9999&zoom=1&wv=00&ht=1500&color=C4&topo=1&ZRa=&ZRb=&lat=&lon=&lonlat=0&x1=&y1=&x2=&y2=&center=0&typ=0&aws=01&wt=0`,
  screen3_right_default: `https://nmsc.kma.go.kr/IMG/GK2A/AMI/PRIMARY/L1B/COMPLETE/KO/{T3}/gk2a_ami_le1b_enhc-wv069_ko020lc_{T2}.srv.png`,

  screen4_left_default: `https://radar.kma.go.kr/cgi-bin/tablet2/nph-rdr_cmp_img?tm={T1}&cmp=HSP&qcd=HSO&obs=ECHD&map=HC&size=800&xp=-9999&yp=-9999&zoom=2&wv=02&ht=800&color=C4&topo=1&ZRa=&ZRb=&lat=&lon=&lonlat=0&x1=&y1=&x2=&y2=&center=0&typ=0&aws=01&wt=0`,
  screen4_right_default: `https://radar.kma.go.kr/cgi-bin/tablet2/nph-rdr_cmp_img?tm={T1}&cmp=HSP&qcd=HSO&obs=ECHD&map=E&size=800&xp=330&yp=620&zoom=5&wv=02&ht=800&color=C4&topo=1&ZRa=&ZRb=&lat=&lon=&lonlat=0&x1=&y1=&x2=&y2=&center=0&typ=0&aws=01&wt=0`,

  //태풍항목
  typoon1_left_default: `https://www.weather.go.kr/w/repositary/image/typ/sat/bt6_{T2}.png`,
  typoon1_right_default: `https://www.weather.go.kr/repositary/image/typ/img/RTKO63_${TYPOON_NAME}00]${TYPOON_SEQ}_ko.png`,

  typoon2_left_default: `https://www.weather.go.kr/w/repositary/image/typ/monitor/kim_typh_fcst_wnd850_ft06_pa4_s000_{T4}.gif`,
  typoon2_right_default: `https://www.weather.go.kr/w/repositary/image/typ/monitor/kim_typh_fcst_wndshr_ft06_pa4_s000_{T4}.gif`,

  typoon3_left_default: `https://www.easterlywave.com/media/typhoon/ensemble/${TYPOON_TIME}/${TYPOON_NAME}.png`,
  typoon3_right_default: `https://www.typhoon2000.ph/multi/data/${TYPOON_NAME}.PNG`,

  typoon4_left_default: "https://data.kma.go.kr/CHT/EXTJ/{T6}/usst_korea_anal_{T5}.gif",
  typoon4_right_default: "https://data.kma.go.kr/CHT/EXTJ/{T6}/usst_korea_anom_{T5}.gif",

  //항목 선택
  item1_left_default:
    "https://afso.kma.go.kr/cgi/wrn/nph-wrn7?tm={T1}&lon=127&lat=37.59&range=80&size=330.00&city=1&tmef=0&tmefl={T1}&name=0&out=0&wrn=W,R,C,D,O,V,T,S,Y,H&lv=0&_DT=RSW:MAPR",
  item2_left_default:
    "https://afso.kma.go.kr/cgi/aws3/nph-aws_min_img1?obs=rn_ex&tm={T1}&val=1&stn=1&obj=mq&map=E&grid=2&legend=1&size=330.00&itv=5&zoom_level=2&zoom_x=3200000&zoom_y=5400000&gov=&_DT=RSW:RNEX",
  item3_left_default:
    "https://afso.kma.go.kr/cgi/aws3/nph-aws_min_img1?obs=rn_60m&tm={T1}&val=1&stn=1&obj=mq&map=E&grid=2&legend=1&size=330.00&itv=60&zoom_level=2&zoom_x=3200000&zoom_y=5400000&gov=&_DT=RSW:RN60M",
  item4_left_default:
    "https://afso.kma.go.kr/cgi/aws3/nph-aws_min_img1?obs=rn_03h&tm={T1}&stn=1&obj=bn&map=E&grid=2&legend=1&size=330.00&itv=5&zoom_level=2&zoom_x=3200000&zoom_y=5400000&gov=&_DT=RSW:RN03H",
  item5_left_default:
    "https://afso.kma.go.kr/cgi/aws3/nph-aws_min_img1?obs=rn_day&tm={T1}&val=1&stn=1&obj=mq&map=E&grid=2&legend=1&size=330.00&itv=5&zoom_level=2&zoom_x=3200000&zoom_y=5400000&gov=&_DT=RSW:RNDAY1",
  item6_left_default:
    "https://afso.kma.go.kr/cgi/aws3/nph-aws_min_img1?obs=rn_acc&tm={T1}&tm_st={T5}&stn=1&obj=bn&map=E&grid=2&legend=1&size=330.00&itv=5&zoom_level=2&zoom_x=3200000&zoom_y=5400000&gov=&_DT=RSW:RN02D",
  item7_left_default:
    "https://afso.kma.go.kr/cgi/aws3/nph-aws_min_img1?obs=rn_acc&tm={T1}&tm_st={T7}&stn=1&obj=bn&map=E&grid=2&legend=1&size=330.00&itv=5&zoom_level=2&zoom_x=3200000&zoom_y=5400000&gov=&_DT=RSW:RN03D",
  item8_left_default:
    "https://afso.kma.go.kr/cgi/lgt/nph-lgt_dst_img?obs=lgt_dst&tm={T1}&val=1&stn=1&obj=bn&map=E&grid=2&legend=1&size=330.00&itv=30&zoom_level=2&zoom_x=3200000&zoom_y=5400000&gov=&_DT=RSW:RDRLGT",
  item9_left_default:
    "https://afso.kma.go.kr/cgi/aws3/nph-aws_min_img1?obs=ta&tm={T1}&val=1&stn=1&obj=mq&map=E&grid=2&legend=1&size=495.00&itv=5&zoom_level=2&zoom_x=3200000&zoom_y=5400000&gov=&_DT=RSW:TA",
  item10_left_default:
    "https://afso.kma.go.kr/cgi/aws3/nph-aws_min_img1?obs=ta_chi&tm={T1}&val=1&stn=1&obj=mq&map=E&grid=2&legend=1&size=495.00&itv=5&zoom_level=2&zoom_x=3200000&zoom_y=5400000&gov=&_DT=RSW:TACHIdf",
};

//화면 1~4 클릭시 기본화면으로 리셋
function changeScreen(screenIndex) {
  currentScreenIndex = screenIndex;
  updateSlider();
}

function screen(left, right) {
  $screenLeft.src = left;
  $screenRight.src = right;
}

/**
 * format
 * 0: 2024-09-30 20:35
 * 1: 202409302035
 * 2: 202409/08/23
 *
 * @param {*} date
 * @param {*} format
 * @returns
 */
function changeDateFormat(date, format = 0) {
  const now = date ? new Date(date) : new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  if (format === 0) return `${year}-${month}-${day} ${hours}:${minutes}`;
  if (format === 1) return `${year}${month}${day}${hours}${minutes}`;
  if (format === 2) return `${year}${month}/${day}/${hours}`;
  if (format === 3) return `${year}${month}${day}${hours}`;
  if (format === 4) return `${year}${month}/${day}`;
}

//현재까지 선택된 시간 데이터 기준으로 슬라이드/시간/이미지 업데이트
function updateSlider(selectedTimeOverride, type = "change") {
  const slider = $timeSlider;
  const currentTimeDisplay = document.getElementById("currentTime");
  const sliderValue = parseFloat(slider.value);
  const hoursDiff = 48 - sliderValue;

  const timeToUse = selectedTimeOverride || selectedTime || currentTime;
  const displayTime = new Date(timeToUse.getTime() - hoursDiff * 60 * 60000);
  currentTimeDisplay.textContent = changeDateFormat(displayTime);

  // 불필요한 리소스 낭비를 방지하기 위해 change 이벤트 발생시에만 이미지 업데이트
  if (type === "change") {
    updateImages(displayTime);
  }
}

/**
 * 이미지 URL 생성기
 */
function generateImageURL(time, url) {
  //매시 5분 단위
  let now = new Date();
  if (url.includes("{T1}")) {
    url = url.replaceAll("{T1}", changeDateFormat(time, 1));
  }

  //9시간 이전 "50분"
  if (url.includes("{T2}") || url.includes("{T3}")) {
    //이미지 생성까지 딜레이 시간 보정
    const DELAY = 22;
    now = new Date(now - UTC_TIME);
    time = new Date(time - UTC_TIME);

    const minutes = time.getMinutes();

    const flooredHour = minutes >= 50 ? time.getHours() : time.getHours() - 1;
    const flooredMinutesFinal = 50;

    time.setHours(flooredHour);
    time.setMinutes(flooredMinutesFinal);
    time.setSeconds(0);

    if (now - time < DELAY * 60 * 1000) time.setHours(time.getHours() - 1);

    url = url.replaceAll("{T2}", changeDateFormat(time, 1));
    url = url.replaceAll("{T3}", changeDateFormat(time, 2));
  }

  //14시 이전 00시
  if (url.includes("{T4}")) {
    now = new Date(now - 14 * 60 * 60 * 1000);
    time = new Date(time - 14 * 60 * 60 * 1000);

    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);

    url = url.replaceAll("{T4}", changeDateFormat(time, 3));
  }

  //전일 00시
  if (url.includes("{T5}" || "{T6}")) {
    time = new Date(time - 1 * 24 * 60 * 60 * 1000);

    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);

    url = url.replaceAll("{T5}", changeDateFormat(time, 3));
    url = url.replaceAll("{T6}", changeDateFormat(time, 4));
  }

  //2일전 00시
  if (url.includes("{T7}")) {
    time = new Date(time - 2 * 24 * 60 * 60 * 1000);

    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);

    url = url.replaceAll("{T7}", changeDateFormat(time, 3));
  }

  return url;
}

function toggleAutoUpdate() {
  const autoUpdateCheckbox = document.getElementById("autoUpdateCheckbox");
  if (autoUpdateCheckbox.checked) {
    startAutoUpdate();
    showNextUpdateDisplay();
  } else {
    stopAutoUpdate();
    hideNextUpdateDisplay();
  }
}

function togglePlay() {
  const playButton = document.getElementById("playButton");
  const slider = document.getElementById("timeSlider");
  if (isPlaying) {
    clearInterval(playInterval);
    playButton.textContent = "재생";
  } else {
    playStartValue = parseFloat(slider.value);
    playInterval = setInterval(() => {
      if (slider.value < 48) {
        slider.value = parseFloat(slider.value) + 1.0;
      } else {
        if (document.getElementById("repeatCheckbox").checked) {
          slider.value = playStartValue;
        } else {
          clearInterval(playInterval);
          playButton.textContent = "재생";
          isPlaying = false;
          return;
        }
      }
      updateSlider();
    }, 2000);
    playButton.textContent = "정지";
  }
  isPlaying = !isPlaying;
}

function getNextUpdateTime() {
  const now = new Date();
  const minutes = Math.floor(now.getMinutes() / 5) * 5;
  const nextUpdate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), minutes, 0, 0);
  nextUpdate.setMinutes(nextUpdate.getMinutes() + 4);
  nextUpdate.setSeconds(10);
  if (nextUpdate <= now) {
    nextUpdate.setMinutes(nextUpdate.getMinutes() + 5);
  }
  return nextUpdate;
}

function startAutoUpdate() {
  function scheduleNextUpdate() {
    const now = new Date();
    const nextUpdate = getNextUpdateTime();
    const timeUntilUpdate = nextUpdate.getTime() - now.getTime();

    console.log(`Next update scheduled at: ${nextUpdate.toLocaleString()}`);

    autoUpdateInterval = setTimeout(() => {
      setLatestTime();
      updateImages(currentTime);
      scheduleNextUpdate();
    }, timeUntilUpdate);
  }

  scheduleNextUpdate();
}

function showNextUpdateDisplay() {
  function updateNextUpdateDisplay() {
    const nextUpdate = changeDateFormat(getNextUpdateTime());

    const nextUpdateDisplay = document.getElementById("nextUpdateDisplay");
    if (nextUpdateDisplay) {
      nextUpdateDisplay.textContent = `NEXT : ${nextUpdate}`;
      nextUpdateDisplay.style.display = "block";
    }
  }

  updateNextUpdateDisplay();
  nextUpdateDisplayInterval = setInterval(updateNextUpdateDisplay, 1000);
}

function hideNextUpdateDisplay() {
  const nextUpdateDisplay = document.getElementById("nextUpdateDisplay");
  if (nextUpdateDisplay) {
    nextUpdateDisplay.style.display = "none";
  }
  clearInterval(nextUpdateDisplayInterval);
}

function stopAutoUpdate() {
  clearTimeout(autoUpdateInterval);
}

/* function generateImageURL(time, url) {
  if (url.indexOf("https://nmsc.kma.go.kr/IMG/GK2A/AMI/PRIMARY/L1B/COMPLETE") !== -1) {
    const current = new Date(new Date() - 9 * 60 * 60 * 1000);
    time = new Date(new Date(time) - 9 * 60 * 60 * 1000);

    //위성사진 완성되는데 10분 이상 소요 되는듯하여 최신
    if (current - time < 10 * 60 * 1000) time = new Date(new Date(time) - 20 * 60 * 1000);
  }

  if (url.indexOf("https://www.weather.go.kr/w/repositary/image/typ/sat/") !== -1) {
    const current = new Date(new Date() - 9 * 60 * 60 * 1000);
    time = new Date(new Date(time) - 9 * 60 * 60 * 1000);

    //위성사진 완성되는데 60분 이상 소요 되는듯하여 최신
    if (current - time < 10 * 60 * 1000) time = new Date(new Date(time) - 60 * 60 * 1000);
  }

  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, "0");
  const day = String(time.getDate()).padStart(2, "0");
  let hours = String(time.getHours()).padStart(2, "0");
  let minutes = String(Math.floor(time.getMinutes() / 5) * 5).padStart(2, "0");

  if (url.indexOf("https://nmsc.kma.go.kr/IMG/GK2A/AMI/PRIMARY/L1B/COMPLETE") !== -1) {
    url = url.replace("{1}", `${year}${month}/${day}/${hours}`);

    minutes = String(Math.floor(minutes / 10) * 10).padStart(2, "0");
    const dateString = `${year}${month}${day}${hours}${minutes}`;
    return `${url.replaceAll("{0}", dateString)}`;
  }

  if (
    url.indexOf("https://www.weather.go.kr/w/repositary/image/typ/monitor/kim_typh_fcst_") !== -1 ||
    url.indexOf("/media/typhoon/ensemble") !== -1 ||
    url.indexOf("https://www.weather.go.kr/w/repositary/image/cht/img/kim_surf_newsur_pa4") !== -1
  ) {
    time = new Date(new Date(time) - 14 * 60 * 60 * 1000);

    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, "0");
    const day = String(time.getDate()).padStart(2, "0");
    let hours = String(time.getHours()).padStart(2, "0");
    let minutes = String(Math.floor(time.getMinutes() / 5) * 5).padStart(2, "0");

    hours = String(Math.floor(time.getHours() / 6) * 6).padStart(2, "0");

    const dateString = `${year}${month}${day}${hours}`;
    return `${url.replaceAll("{0}", dateString)}`;
  } else if (url.indexOf("https://www.weather.go.kr/w/repositary/image/cht/img/kor1_anlmod_pb4") !== -1) {
    const current = new Date(new Date() - 9 * 60 * 60 * 1000);
    baseTime = new Date(new Date(time) - 9 * 60 * 60 * 1000);

    // 이미지 생성시간 고려 10분이 안되었으면 1시간 전 이미지로 대신 노출
    if (current - time < 10 * 60 * 1000) time = new Date(new Date(time) - 60 * 60 * 1000);

    const baseyear = baseTime.getFullYear();
    const basemonth = String(baseTime.getMonth() + 1).padStart(2, "0");
    const baseday = String(baseTime.getDate()).padStart(2, "0");
    const basehours = String(baseTime.getHours()).padStart(2, "0");

    const dateString = `${baseyear}${basemonth}${baseday}${basehours}`;

    return `${url.replaceAll("{0}", dateString)}`;
  } else if (url.indexOf("https://afso.kma.go.kr/cgi/aws3/nph-aws_min_img1?obs=rn_acc") !== -1) {
    const baseTime = new Date(time);

    if (url.indexOf("_DT=RSW:RN03D") !== -1) {
      baseTime.setDate(time.getDate() - 2);
    } else if (url.indexOf("_DT=RSW:RN02D") !== -1) {
      baseTime.setDate(time.getDate() - 1);
    }

    baseTime.setHours(0, 0, 0, 0);

    const baseyear = baseTime.getFullYear();
    const basemonth = String(baseTime.getMonth() + 1).padStart(2, "0");
    const baseday = String(baseTime.getDate()).padStart(2, "0");
    const basehours = String(baseTime.getHours()).padStart(2, "0");
    url = url.replace("{1}", `${baseyear}${basemonth}${baseday}${basehours}`);

    const dateString = `${year}${month}${day}${hours}${minutes}`;
    return `${url.replaceAll("{0}", dateString)}&cache_bust=${new Date().getTime()}`;
  } else if (url.indexOf("https://www.weather.go.kr/w/repositary/image/typ/sat/") !== -1) {
    let now = new Date(time);

    let minutes = now.getMinutes();

    if (minutes >= 50) {
      minutes = 50;
    } else {
      now = new Date(new Date(time) - 1 * 60 * 60 * 1000);
      hours = now.getHours();
      minutes = 50;
    }

    // 포맷팅된 시간 문자열 생성
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    const dateString = `${year}${month}${day}${formattedHours}${formattedMinutes}`;
    return `${url.replaceAll("{0}", dateString)}`;
  } else if (url.indexOf("https://www.typhoon2000.ph/multi/data/") !== -1) {
    return `${url.replaceAll("{typoon}", typoonName)}`;
  } else if (url.indexOf("https://data.kma.go.kr/CHT/EXTJ/") !== -1) {
    const baseTime = new Date(time);

    baseTime.setDate(time.getDate() - 1);
    baseTime.setHours(0, 0, 0, 0);

    const baseyear = baseTime.getFullYear();
    const basemonth = String(baseTime.getMonth() + 1).padStart(2, "0");
    const baseday = String(baseTime.getDate()).padStart(2, "0");
    const basehours = String(baseTime.getHours()).padStart(2, "0");
    url = url.replace("{2}", `${baseyear}${basemonth}/${baseday}`);

    const dateString = `${baseyear}${basemonth}${baseday}${basehours}`;
    return `${url.replaceAll("{0}", dateString)}`;
  } else {
    const dateString = `${year}${month}${day}${hours}${minutes}`;
    return `${url.replaceAll("{0}", dateString)}&cache_bust=${new Date().getTime()}`;
  }
}
 */
function setLatestTime() {
  $datePicker.value = changeDateFormat();
  $timeSlider.value = 48;
  updateSlider();
}

function adjustTime(hours) {
  const slider = $timeSlider;
  let newValue = parseFloat(slider.value) + hours;
  newValue = Math.max(0, Math.min(48, newValue));
  slider.value = newValue;
  updateSlider();
}

//전달된 시간 기준으로 이미지 정보 업데이트
function updateImages(time) {
  if (currentScreenIndex === 1 || currentScreenIndex === 2 || currentScreenIndex === 3 || currentScreenIndex === 4) {
    document.querySelector("#items").options[0].selected = true;
    document.querySelector("#typoons").options[0].selected = true;
    screen(
      generateImageURL(time, baseImages[`screen${currentScreenIndex}_left_default`]),
      generateImageURL(time, baseImages[`screen${currentScreenIndex}_right_default`])
    );
    currentRightSrc = baseImages[`screen${currentScreenIndex}_right_default`];
  }

  if (
    currentScreenIndex === "TP1" ||
    currentScreenIndex === "TP2" ||
    currentScreenIndex === "TP3" ||
    currentScreenIndex === "TP4"
  ) {
    document.querySelector("#items").options[0].selected = true;
    screen(
      generateImageURL(time, baseImages[`typoon${currentScreenIndex.substr(2)}_left_default`]),
      generateImageURL(time, baseImages[`typoon${currentScreenIndex.substr(2)}_right_default`])
    );
    currentRightSrc = baseImages[`screen${currentScreenIndex}_right_default`];
  }

  if (
    currentScreenIndex === "item1" ||
    currentScreenIndex === "item2" ||
    currentScreenIndex === "item3" ||
    currentScreenIndex === "item4" ||
    currentScreenIndex === "item5" ||
    currentScreenIndex === "item6" ||
    currentScreenIndex === "item7" ||
    currentScreenIndex === "item8" ||
    currentScreenIndex === "item9" ||
    currentScreenIndex === "item10"
  ) {
    screen(
      generateImageURL(time, baseImages[`item${currentScreenIndex.substr(4)}_left_default`]),
      generateImageURL(time, currentRightSrc)
    );
  }
  /* 
  if (currentScreenIndex === "TP2") {
    $screenLeft.src = generateImageURL(time, baseImages.typoon2_left_default);
    $screenRight.src = generateImageURL(time, baseImages.typoon2_right_default);
  }

  if (currentScreenIndex === "TP3") {
    $screenLeft.src = generateImageURL(time, baseImages.typoon3_left_default);
    $screenRight.src = generateImageURL(time, baseImages.typoon3_right_default);
  }

  if (currentScreenIndex === "TP4") {
    $screenLeft.src = generateImageURL(time, baseImages.typoon4_left_default);
    $screenRight.src = generateImageURL(time, baseImages.typoon4_right_default);
  } */
  /*
  if (currentScreenIndex === "item1") $screenLeft.src = generateImageURL(time, baseImages.item1_left_default);
  if (currentScreenIndex === "item2") $screenLeft.src = generateImageURL(time, baseImages.item2_left_default);
  if (currentScreenIndex === "item3") $screenLeft.src = generateImageURL(time, baseImages.item3_left_default);
  if (currentScreenIndex === "item4") $screenLeft.src = generateImageURL(time, baseImages.item4_left_default);
  if (currentScreenIndex === "item5") $screenLeft.src = generateImageURL(time, baseImages.item5_left_default);
  if (currentScreenIndex === "item6") $screenLeft.src = generateImageURL(time, baseImages.item6_left_default);
  if (currentScreenIndex === "item7") $screenLeft.src = generateImageURL(time, baseImages.item7_left_default);
  if (currentScreenIndex === "item8") $screenLeft.src = generateImageURL(time, baseImages.item8_left_default);
  if (currentScreenIndex === "item9") $screenLeft.src = generateImageURL(time, baseImages.item9_left_default);
  if (currentScreenIndex === "item10") $screenLeft.src = generateImageURL(time, baseImages.item10_left_default); */
}

function jumpToDate() {
  selectedTime = new Date($datePicker.value);
  selectedTime.setMinutes(Math.floor(selectedTime.getMinutes() / 5) * 5);
  $timeSlider.value = 48;
  updateSlider(selectedTime);
}

function updateDatePickerDefault() {
  $datePicker.value = changeDateFormat();
}

function init() {
  setLatestTime();
  jumpToDate();
  updateImages(currentTime);
  updateDatePickerDefault();
  currentTimeInterval = setInterval(updateDatePickerDefault, 1000);
}

init();