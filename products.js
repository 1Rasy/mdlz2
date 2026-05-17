const products = [
  {
    id: 1,
    name: "奥利奥夹心饼干",
    category: "饼干",
    image: "images/1.jpg", // 默认头图（列表页展示）
    tag: "热卖",
    variants: [
      {
        flavor: "原味",
        spec: "97g",
        price: "¥4.8",
        image: "images/1.jpg" // 对应原味的规格图
      },
      {
        flavor: "草莓味",
        spec: "97g",
        price: "¥5.2",
        image: "images/2.jpg" // 对应草莓味的规格图
      },
      {
        flavor: "巧克力味",
        spec: "118g",
        price: "¥6.5",
        image: "images/4.jpg" // 对应巧克力味的规格图
      }
    ]
  },
  {
    id: 2,
    name: "炫迈口香糖",
    category: "口香糖",
    image: "images/5.jpg", // 默认头图
    tag: "本周主推",
    variants: [
      {
        flavor: "薄荷味",
        spec: "35粒",
        price: "¥7.5",
        image: "images/6.jpg" // 对应薄荷味的规格图
      },
      {
        flavor: "青柠味",
        spec: "35粒",
        price: "¥7.8",
        image: "images/7.jpg" // 对应青柠味的规格图
      }
    ]
  }
];
