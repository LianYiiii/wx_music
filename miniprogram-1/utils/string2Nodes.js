export default function stringToNodes(keyword, value){
  const nodes = [];

  if(suggestKeyWords[keyword].toUpperCase().startsWith(searchValue.toUpperCase())){
    console.log(suggestKeyWords[keyword]);
    const key1 = suggestKeyWords[keyword].slice(0, searchValue.length);
    console.log(key1);
    const node1 = {
      name: 'span',
      attrs: {style: "color: #26ce8a;"},
      children: [{type: "text", text: key1}]
    };
    nodes.push(node1);
    
    const key2 = suggestKeyWords[keyword].slice(searchValue.length);
    console.log(key2);
    const node2 = {
      name: 'span',
      attrs: {style: "color: #000; font-size: 32rpx;"},
      children: [{type: "text", text: key2}]
    };
    nodes.push(node2);
  }else{
    console.log(suggestKeyWords[keyword]);
    const node = {
      name: 'span',
      attrs: {style: "color: #000;"},
      children: [{type: "text", text: suggestKeyWords[keyword]}]
    };
    nodes.push(node);
  }
  suggestSongsNodes.push(nodes);
this.setData({suggestSongsNodes: suggestSongsNodes})

}