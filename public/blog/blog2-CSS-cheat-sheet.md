# CSS Cheat Sheet: what I used to build this website

When building this personal website, I encountered many keywords that seemed confusing at first. To help others (and my self), I’ve compiled this cheat sheet. It translates technical jargon into simple concepts.

### The Cheat Sheet

| Keyword | Simple Explanation | Example |
| :--- | :--- | :--- |
| **`:root`** | **The Variable Warehouse.** This is where you define global variables. If you change a color here, it updates everywhere on your site. | `--bg-light: #fff;`<br>*(Defining a color variable)* |
| **`var(--name)`** | **Fetch Value.** This tells the browser to go to the "Warehouse" (`:root`) and grab a specific variable to use. | `color: var(--text-light);` |
| **`flex`** | **Elastic Layout.** A modern layout tool. It makes the items inside a container line up automatically (rows or columns) and fill the available space. | `display: flex;` |
| **`flex-direction`** | **Queue Direction.** Decides if the "flex" items should line up horizontally (`row`) or vertically (`column`). | `flex-direction: column;`<br>*(Stack from top to bottom)* |
| **`fixed`** | **Nail It Down.** Pins an element to a specific spot on the screen. Even if you scroll the page, this element stays stuck there (like a sidebar or header). | `position: fixed;` |
| **`relative`** | **Relative Positioning.** Positions an element relative to its normal spot. It is often used as a reference point (parent) for `absolute` children. | `position: relative;` |
| **`absolute`** | **Absolute Positioning.** Positions an element relative to its nearest "positioned" parent. You can tell it exactly where to go (e.g., top-left corner). | `top: 0; left: 0;`<br>*(Stick to the top-left)* |
| **`z-index`** | **Layer Height.** Think of layers in Photoshop. Higher numbers sit on top of lower numbers. It decides who covers whom. | `z-index: 99;`<br>*(I am important, don't cover me!)* |
| **`hover`** | **Mouse Over.** Defines what happens when a user's mouse cursor hovers over an element (like a button changing color). | `a:hover { color: red; }` |
| **`::before`** | **The "Ghost" Element.** Creates a fake element *before* the content of the selected element. Great for adding decorations like icons or dots without changing HTML. | `li::before { content: "📍"; }` |
| **`!important`** | **The Royal Decree.** Forces the browser to use this style, ignoring almost all other rules. Use with caution! | `border: none !important;` |
| **`@media`** | **Media Query.** The key to Responsive Design. It says: "If the screen size is X, then do Y." | `@media (max-width: 768px) { ... }`<br>*(Styles for mobile)* |
| **`vh` / `vw`** | **Viewport Units.** `100vh` equals 100% of the screen's height. `100vw` is 100% of the width. | `min-height: 100vh;`<br>*(Take up the full screen height)* |

---

# CSS 关键字速查表：构建这个网站使用到的关键字
在搭建我的个人网站时，我遇到了很多一开始让人摸不着头脑的关键字。为了帮助其他人（也为了方便自己），我整理了这份速查表。它把技术术语翻译成了简单的概念。

### 速查表

| 关键字 (Keyword) | 通俗解释 | 举例 |
| :--- | :--- | :--- |
| **`:root`** | **变量仓库**。定义全局变量的地方。就像你在编程里定义常量一样，以后只要在这里改一个颜色，全站都会跟着变。 | `--bg-light: #fff;`<br>*(定义一个叫 bg-light 的颜色)* |
| **`var(--name)`** | **取变量值**。告诉浏览器去“仓库” (`:root`) 里把某个具体的变量拿出来用。 | `color: var(--text-light);` |
| **`flex`** | **弹性布局**。现代 CSS 排版神器。它让容器里的子元素可以自动排队（横排或竖排）、自动填充剩余空间。 | `display: flex;` |
| **`flex-direction`** | **排队方向**。决定子元素是横着排 (`row`) 还是竖着排 (`column`)。 | `flex-direction: column;`<br>*(从上往下排)* |
| **`fixed`** | **钉死位置**。让元素像钉子一样钉在屏幕的某个位置。就算你滚动页面，它也纹丝不动（比如侧边栏 Sidebar）。 | `position: fixed;` |
| **`relative`** | **相对定位**。以自己原来的位置为基准。通常用来给里面的 `absolute` 元素当“爸爸”（定位参照物）。 | `position: relative;` |
| **`absolute`** | **绝对定位**。相对于最近的一个设定了定位的“爸爸”进行定位。你可以精确地告诉它去哪儿（比如左上角）。 | `top: 0; left: 0;`<br>*(贴在爸爸的左上角)* |
| **`z-index`** | **图层高度**。就像 Photoshop 的图层。数字越大，越在上面，越不容易被其他元素盖住。 | `z-index: 99;`<br>*(我很重要，别挡着我)* |
| **`hover`** | **鼠标悬停**。当用户的鼠标放在这个元素上时发生的事情（比如按钮变色）。 | `a:hover { color: red; }` |
| **`::before`** | **伪元素 (幽灵元素)**。在元素的内容**之前**，凭空变出一个“假”元素。常用来做装饰（比如小圆点、小图标），而不用改 HTML。 | `li::before { content: "📍"; }` |
| **`!important`** | **圣旨 (强制执行)**。告诉浏览器：“听我的，别管其他规则，必须用这个样式！”（慎用，除非是为了覆盖顽固的旧样式）。 | `border: none !important;` |
| **`@media`** | **媒体查询**。实现“响应式设计”的关键。意思是：“如果屏幕宽度小于 xxx，就执行下面的代码”。 | `@media (max-width: 768px) { ... }`<br>*(手机端样式)* |
| **`vh` / `vw`** | **视口单位**。`100vh` = 屏幕高度的 100% (Viewport Height)。 | `min-height: 100vh;`<br>*(至少占满一整个屏幕高)* |