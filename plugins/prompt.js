/**
 * 对话框插件
 * 通用性
 * 易用性
 * 尽量不要与其它功能冲突
 * 打开一个确认对话框
 * 可以传按钮的样式类名，自定义样式
 */

if (!window.myPlugin) {
  window.myPlugin = {};
}

myPlugin.openConfirm = (function () {
  var divModal,
    divCenter,
    options,
    spanTitle,
    spanClose,
    divContent,
    btnConfirm,
    btnCancel,
    isRegEvent = false;

  function openConfirm(opts) {
    // 判断如果传进来的是字符串
    if (typeof opts === "string") {
      opts = {
        title: opts,
      };
    }
    if (!opts) {
      opts = {};
    }
    options = opts;
    initModal();
    initCenterDiv();
    regEvent();
  }
  /**
   * 初始化元素
   */
  function initModal() {
    if (!divModal) {
      divModal = document.createElement("div");
      divModal.style.position = "fixed";
      divModal.style.background = "rgba(0,0,0,.2)";
      divModal.style.width = divModal.style.height = "100%";
      divModal.style.top = divModal.style.left = 0;
      document.body.appendChild(divModal);
    }
    divModal.style.display = "block";
  }

  /**
   * 初始化中间的div
   */
  function initCenterDiv() {
    if (!divCenter) {
      divCenter = document.createElement("div");
      divCenter.style.position = "absolute";
      divCenter.style.width = "260px";
      divCenter.style.height = "160px";
      divCenter.style.top = divCenter.style.left = "50%";
      divCenter.style.transform = "translate(-50%, -50%)";
      divCenter.style.background = "#fff";
      divCenter.style.fontSize = "14px";
      initCenterDivContent();
      divModal.appendChild(divCenter);

      btnConfirm = divCenter.querySelector("[data-myplugin-id=confirm]");
      btnCancel = divCenter.querySelector("[data-myplugin-id=cancel]");
      spanTitle = divCenter.querySelector("[data-myplugin-id=title]");
      spanClose = divCenter.querySelector("[data-myplugin-id=close]");
      divContent = divCenter.querySelector("[data-myplugin-id=content]");
    }
    // 设置配置的内容
    spanTitle.innerText = options.title || "信息";
    divContent.innerText = options.content || "确定要删除吗？";
    btnConfirm.innerText = options.confirmText || "确定";
    btnConfirm.className = options.confirmClass || "";
    btnCancel.innerText = options.cancelText || "取消";
    btnCancel.className = options.cancelClass || "";
  }

  /**
   * 初始化中间的div的内部
   */

  function initCenterDivContent() {
    // 创建内部的标题div
    var div = document.createElement("div");
    div.style.height = "40px";
    div.style.background = "rgba(248, 248, 248)";
    div.style.boxSizing = "border-box";
    div.style.padding = "10px 20px 0";
    div.innerHTML = `
        <span style="float: left;" data-myplugin-id="title"></span>
        <span  data-myplugin-id="close" style="float: right; cursor: pointer;">
            <img style="width: 18px; height: 18px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAEdUlEQVR4nO3dQW7bOACG0f8G02Uukk3QBTfBYJCV73+JAi3SoA2QWRhCUyRxbEukSOk9QHuS1mfGNkIlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACf+LL2AHbImg/ikORbktu1B7Ijtzmu+WHtgXDaIclzkpck3yOSFm5zXOuXHNdeJJ16Hcd0iaSu13FMl0g69F4cIqnrvThE0qFTcYikjlNxiKQj58QhkmWdE4dIOnBJHCJZxiVxiGRF18QhknmuiUMkK5gTh0iuMycOkTS0RBwiucxd5schkgaWjEMk57lL8phl11wkFdxk2Rfp9fUjydd2UxnG1yQ/U2/db9pNZR9q7CDT9ZjjuyVHNXYOO0gDIqlPHIMTST3i2AiRLE8cGyOS5Yhjo0Qynzg2TiTXE8dOiORy4tgZkZxPHDslks/VjON3xNE9kXysdhwP7abCHIccXzCR/CEO/vIQkUxKxME7RHKM4yni4AN7jqREHJxhj5GUiIML7CmSEnFwhT1EUiIOZqgdSWk2k7dKxMECakbylHUiKREHC9pSJCXioIItRFIiDioaOZIScdDAiJGUiIOGRoqkpF4cvyIOPjBCJCV147hfYIxsWM+RlIiDDvQYSYk46EhPkdxHHHToIccbaM1I7iuOQRzMVvMG/SwScTCENSIRB0NpGYk4GNJ96ty001UiDgb3X+oFUvORZy9J/q2wHvBGzXd5OwebMEok4mA1vUciDlbXayTioBu9RSIOutNLJE8RB51aO5K1TlSBs60ViTgYRutIxMFwWkUiDoZVOxJxMLSa/wk4BeIbK4bU6k8sv3kwnNYf0kXCMNb6mlckdG/tHwpFQrfWjkMkdKuXOERCd3qLQyR0o9c4RMLqeo9DJKxmlDhEQnMPqXcj/0zdo388GIeqWhwcV+IkdwbU8ujREpEwkDUOry4RCQNY8xkhJSKhYz08ZapEJHSohzgmJSKhIz3FMSnxbHQ60GMck5J6kfyOSPhEz3FMSkTCCkaIY1IiEhoaKY5JiUhoYMQ4JiUioaKR45iUiIQKthDHpEQkLGhLcUxKRMICasbxmHXPyi0RCTPUjuOu3VQ+VCISrrCHOCYlIuECe4pjUnIcm0g46ZD9xTG5i0g44ZDkOfuMYyIS3iWOP0TCX8TxlkhIIo5TRLJz4vicSHZKHOerHcmh3VQ4hzguVzOS54ikG+K4nkg2ThzziWSjxLEckWxMzTi+Z19xTESyEbXjuG03le6IZHDiqE8kgxJHOyIZzE3qvFgvSX5kn585PvM1dR8Hd9NuKvtQYwexc5xWYyexg1S0ZCTiOM9djmsljkEsEYk4LnOb+ZGIo6E5kYjjOnMiEccKrolEHPNcE4k4VnRJJOJYxiWRiKMD50QijmWdE4k4OnIqEnHUcSoScXTovUjEUdd7kYijY68jEUcbryMRxwAOSb5FHC3d5rjm4hjEP2sPYIe+rD0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKBz/wMdVxPuxCtN+wAAAABJRU5ErkJggg==" alt="" />
        </span>
    `;
    divCenter.appendChild(div);

    // 创建提示文本div
    div = document.createElement("div");
    div.dataset.mypluginId = "content";
    div.style.height = "70px";
    div.style.boxSizing = "border-box";
    div.style.padding = "20px";
    divCenter.appendChild(div);

    // 创建按钮div
    div = document.createElement("div");
    div.style.height = "50px";
    div.style.boxSizing = "border-box";
    div.style.padding = "10px 20px";
    div.style.textAlign = "right";
    div.innerHTML = `
        <button  data-myplugin-id="confirm" style="background: #269FD8; color: #fff; border: none; border-radius: 5px; outline: none; padding: 3px 8px; letter-spacing: 2px; cursor: pointer"></button>
        <button  data-myplugin-id="cancel" style="background: #269FD8; color: #fff; border: none; border-radius: 5px; outline: none; padding: 3px 8px; letter-spacing: 2px; cursor: pointer"></button>
    `;
    divCenter.appendChild(div);
  }

  /**
   * 注册事件
   */
  function regEvent() {
    if (!isRegEvent) {
      isRegEvent = true;

      spanClose.onclick = function () {
        divModal.style.display = "none";
      };
      divModal.onclick = function (e) {
        // 因为事件会冒泡 所以要判断点击的元素是当前元素divModal
        // 表示点击的是当前元素divModal
        if (e.target === this) {
          divModal.style.display = "none";
        }
      };
      btnConfirm.onclick = function () {
        if (options.success) {
          options.success();
          divModal.style.display = "none";
        }
      };
      btnCancel.onclick = function () {
        if (options.fail) {
          options.fail();
          divModal.style.display = "none";
        }
      };
    }
  }

  return openConfirm;
})();
