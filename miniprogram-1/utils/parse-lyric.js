const timeRegExp = /\[(\d{2})\:(\d{2})\.(\d{2,3})\]/;

export function parseLyric(lyricString){
  const lyricStrings = lyricString.split('\n');
  // console.log(lyricStrings);

  const lyricInfo = [];

  for(const linestring of lyricStrings){
    // [04:40.30] 音乐发行营销：奔跑怪物
    // console.log(linestring);

    const timeResult = timeRegExp.exec(linestring);
    // ["[03:53.76]", "03", "53", "76", index: 0, input: "[03:53.76]监制：许雯静 Vivian Xu/刘嘉雄 Charles Liu/小贾", groups: undefined]
    // console.log(timeResult);

    if(!timeResult) continue;

    // 1. 格式化时间
    const minute = Number(timeResult[1]) * 60 * 1000;
    const second = Number(timeResult[2]) * 1000;
    const millSecondTime = Number(timeResult[3]);
    const millSecond = millSecondTime.length === 2 ? millSecondTime * 10 : millSecondTime * 1;

    // console.log(minute, second, millSecondTime, millSecond);
    const time = minute + second + millSecond;

    // 2. 格式化文本
    const textLyric = linestring.replace(timeRegExp, "");
    // console.log(textLyric);

    lyricInfo.push({time, textLyric});
  }
  return lyricInfo;
}