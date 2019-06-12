## Single-title 标题文本

### 属性配置
------
| 属性名 | 类型 | 默认值 | 描述 | 备注 |
| ------ | ------ | ------ | ------ | ------ |
| 文本内容 | Text | XXX_大屏 | 设置标题文本的内容 | - |
| 文本样式 | Group | - | 设置标题文本的文本样式 | - |
| 超链接配置 | Group | - | 设置标题文本的超链接 | - |

##### 文本样式
| 属性名 | 类型 | 默认值 | 描述 | 备注 |
| ------ | ------ | ------ | ------ | ------ |
| 字体 | Search | Microsoft Yahei | 设置文本的字体类型 | - |
| 字号 | Number | 36 | 设置文本的字体大小 | - |
| 字体颜色 | Color | #fff | 设置文本的字体颜色 | - |
| 背景 | Color | rgba(0, 0, 0, 0) | 设置文本的背景 | - |
| 字体粗细 | Search | normal | 设置文本的粗细 | - |
| 对齐方式 | Select | center | 设置文本的对齐方式 | - |

##### 超链接配置
| 属性名 | 类型 | 默认值 | 描述 | 备注 |
| ------ | ------ | ------ | ------ | ------ |
| 超链接 | Text | '' | 设置文本的外链地址 | - |
| 是否新打开窗口 | Boolean | false | 设置文本的外链接打开方式 | - |
| 悬停文字颜色 | Color | #fff | 设置文本开启外链hover时的文字颜色 | - |
 悬停显示下划线 | Boolean | false | 设置文本开启外链hover时，文字是否显示下划线 | - |
 
### 数据配置
------

#### source（默认）

##### 数据字段

| 字段名 | 类型 | 默认值 | 描述 | 备注 |
| ------ | ------ | ------ | ------ | ----- |
| value | String | '' | 文本的内容 | - |
| url | String | '' | 文本外链的`href`地址 | - |

##### 静态数据
```
[
  {
    "value": "",
    "url": ""
  }
]
```

### 交互配置
-----
*NA*