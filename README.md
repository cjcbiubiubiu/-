### 这是框通用型提示框插件

    >>> 模仿了layui的提示框样式
    使用时：myPlugin.openConfirm()
    1.可只传字符串使用默认样式
    2.传入一个对象：
    属性名有title, 表示这个提示框的名字，
    有content, 表示提示框的内容, 
    有confirmText与cancelText属性分别代表'确定'与'取消'的文本, 
    还可以自定义两个按钮的样式, 传入属性名confirmClass与cancelClass，
    有两个方法，确认时的回调success: function() {}，
    取消时的回调fail: function() {}
