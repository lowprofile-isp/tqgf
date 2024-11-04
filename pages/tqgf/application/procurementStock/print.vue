<template>
  <view>
	<u-button @click="bluePrint">打印</u-button>
    <!-- <u-popup v-model="modalVisible" class="content" mode="bottom" height="75%">
      <view class="x-print-content">
        <template v-for="(item, index) in labelConfigList">
          <canvas :key="index" class="label-canvas" :canvas-id="`label-canvas-${index}`"
            :id="`label-canvas-${index}`"></canvas>
        </template>
 
      </view>
      <view class="x-footer-width-not">
        <x-button type="main" plain @click="cancalHandler">取 消</x-button>
        <x-button type="main" @click="bluePrint">蓝牙打印</x-button>
        <x-button type="main" @click="confirmHandler">本机打印</x-button>
      </view>
 
    </u-popup> -->
    <u-popup v-model="popupShow" mode="center" width="85%" height="60%">
      <u-cell-group title="已配对设备">
        <u-cell-item v-for="(item, index) in pairedList" :key="index" :title="item.btName" :value="item.status"
          @click="cellClick(1, item)"></u-cell-item>
      </u-cell-group>
 
      <u-cell-group title="可用设备">
        <u-cell-item v-for="(item, index) in searchList" :key="index" :title="item.btName" :arrow="true"
          @click="cellClick(2, item)"></u-cell-item>
        <x-button type="main" :loading="isSearch" @click="againSearch"
          :style="{ background: isSearch ? '#fff' : '#2a75e5' }">
          <u-icon v-if="!isSearch" name="reload" size="28" @click="againSearch"></u-icon>
        </x-button>
      </u-cell-group>
    </u-popup>
    <!-- <u-top-tips ref="uTips"></u-top-tips> -->
  </view>
</template>
 
<script>
// import _canvas from '@/utils/canvas.js'; // 加载万能绘制方法
let LySDKModulePrinter = uni.requireNativePlugin('LY028-NativeSdk-Printer');
const HYprint = uni.requireNativePlugin('Common-Print');
export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '打印'
    },
    labelConfigList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    modalVisible: {
      get () {
        return this.drawer
      },
      set (val) {
        this.$emit('update:drawer', val)
      }
    }
  },
  data () {
    return {
      isSearch: false,
      popupShow: false,
      pairedList: [], // 已配对列表
      searchList: [], //搜索列表
      blueToothInfo: null,
 
      result: '',
      label: []
    }
  },
  methods: {
    formatPrintContent () {
      let arr = []
      this.labelConfigList.forEach(item => {
        let data = item.data
        let [qrmatCode, qrcode, qrsupplier] = item.qrcodeText ? item.qrcodeText.split("|") : []
        // var str = " ! 0 200 200 200 1 " + '\r\n';
        // str += "EG 9 79 10 505" + result + "\r\n";
 
        // 标签开始, 固定开头, 详见 指令集文档
        var str = " ! 0 200 200 500 1 " + '\r\n';
        // 设置打印纸张宽度
        str += "PAGE-WIDTH 600" + '\r\n';
        // 标签内容
        // 文本 {command} {font} {size} {x} {y} {data}
        str += "TEXT 24 3 30 20 " + 'XXXX' + " \r\n ";
        // 二维码 {command} {type} {x} {y} [M n] [U n] {data}
        str += "B QR 380 20 M 2 U 8" + '\r\n';
        str += "MA," + item.qrcodeText + "\r\n";
        str += "ENDQR" + '\r\n';
        str += "TEXT 24 0 30 100 " + '箱号' + "\r\n";
        str += "TEXT 24 0 30 150  " + qrmatCode + "\r\n";
        str += "FORM " + "\r\n";
        // 标签结束
        str += "PRINT\r\n";
        arr.push(str)
      })
      return arr
    },
    // 批量打印
    bluetoothBatchPrint (arr) {
      if (arr.length === 0) return false
      const result = arr.reduce((acc, nextContent) => {
        return acc.then(() => {
          return this.bluetoothPrint(nextContent)
        })
      }, Promise.resolve())
 
      result.then((ret) => {
        // uni.showToast({
        //   title: '已打印',
        //   icon: 'none'
        // })
      })
    },
    // 单一打印
    async bluetoothPrint (content) {
      return new Promise((resolve) => {
        HYprint.bluetoothPrint({
          content: content //打印命令内容
        }, result => {
          if (result.code === -100 || result.code === -200) {
            uni.showToast({
              title: result.msg,
              icon: 'none'
            })
            uni.removeStorageSync('blueToothInfo')
            return false
          }
          const msg = JSON.stringify(result);
          console.log(msg, '打印')
          resolve(result)
        });
      })
    },
    // 开始打印
    async bluetoothPrintStart () {
      this.bluetoothBatchPrint(this.formatPrintContent())
    },
    async againSearch () {
      this.isSearch = true
      let pairedAddr = this.pairedList.map(item => item.address)
      let list = await this.getBluetoothList()
      this.searchList = list
      this.isSearch = false
    },
    async cellClick (flag, item) {
      // if (flag === 1) {
      //   // 取消配对
      // }
      // if (flag === 2) {
      // 连接
      let po = {
        btAddress: item.btAddress,//蓝牙地址
        btName: item.btName//蓝牙名称
      }
      if (!po.btAddress) {
        uni.showToast({
          title: '无法连接（请检查打印机设备蓝牙是否已打开）',
          icon: 'none'
        })
        uni.removeStorageSync('blueToothInfo')
        return false
      }
      uni.showLoading({
        title: '请稍后'
      });
      let goto = await this.bluetoothConnectInit(po)
      uni.hideLoading();
      if (goto) {
        // 触发打印动作
        this.popupShow = false
        this.cancalHandler()
        this.bluetoothPrintStart()
        uni.setStorageSync('blueToothInfo', JSON.stringify(po))
      } else {
        uni.showToast({
          title: '无法连接（请检查打印机设备蓝牙是否已打开）',
          icon: 'none'
        })
        uni.removeStorageSync('blueToothInfo')
      }
      // }
    },
    async getBluetoothConnectState (po) {
      // 判断是否已经连接
      return new Promise((resolve) => {
        HYprint.bluetoothConnectState({
          btAddress: po.btAddress
        }, result => {
          resolve(result.state)
        });
      })
    },
    async createBluetoothConnect (po) {
      // 建立连接
      return new Promise((resolve) => {
        HYprint.bluetoothConnect(po, result => {
          if (result.code === -100 || result.code === -200) {
            uni.showToast({
              title: result.msg,
              icon: 'none'
            })
            return false
          }
          if (result.code === true) resolve(result.code)
          if (result.code === false) resolve(result.code)
        });
      })
    },
    async bluetoothConnectInit (po) {
      // 判断是否已经连接
      let isC = await this.getBluetoothConnectState(po)
      console.log(isC, 'isC1')
      // 建立连接
      if (!isC) {
        isC = await this.createBluetoothConnect(po)
        console.log(isC, 'isC2')
      }
      console.log(isC, 'isC')
      return isC
    },
    async bluePrint () {
      /**
       * 1、判断是否支持蓝牙 isSupport
       * 2、判断蓝牙是否打开 openBlueStatus（未打开 则打开蓝牙）
       * 3、搜索蓝牙列表 展示出来 以供用户选择 （增加一个 刷新搜索按钮）
       * 4、根据用户选的蓝牙名称 （判断蓝牙是否连接）连接蓝牙（停止搜索蓝牙）
       * 5、连接蓝牙后 打印
       * 
      */
      //  是否支持蓝牙
      let isSupport = await this.isSupportBluetooth()
      let openBlueStatus = false
      if (!isSupport) {
        // 打开蓝牙
        openBlueStatus = await this.autoOpenBluetooth()
      } else {
        openBlueStatus = true
      }
 
      if (openBlueStatus) {
        this.blueToothInfo = JSON.parse(uni.getStorageSync('blueToothInfo') || null)
        if (this.blueToothInfo && this.blueToothInfo.btAddress) {
          this.cellClick(1, this.blueToothInfo)
          return false
        }
        // uni.showLoading({
        //   title: '搜索中'
        // });
        // 已配对
        this.pairedList = await this.getPairedList()
        let pairedAddr = this.pairedList.map(item => item.address)
        // 可用
        this.popupShow = true
        // uni.hideLoading();
        this.isSearch = true
        let list = await this.getBluetoothList()
        this.searchList = list
        this.isSearch = false
      }
    },
    getPairedList () {
      return new Promise((resolve) => {
        HYprint.listBondedBT(result => {
          console.log(result, '获取已配对列表')
          //result数据：{"msg":"搜索完成","list":[{"name":"蓝牙名称","address":"mac地址","status":"配对状态"}]} 
          // const msg = JSON.stringify(result);
          resolve(JSON.parse(result.list))
        })
      })
    },
    getBluetoothList () {
      return new Promise((resolve) => {
        HYprint.bluetoothList({
        }, result => {
          // code 0-搜索完成 2 搜索中
          if (result.code === 0) {
            resolve(result.list)
          }
        })
      })
    },
    autoOpenBluetooth () {
      return new Promise((resolve) => {
        HYprint.openBT(result => {
          //result数据：{"status":true} 
          resolve(result.status)
        })
      })
    },
    isSupportBluetooth () {
      return new Promise((resolve) => {
        HYprint.isOpen(result => {
          //result数据：{"status":true} 
          resolve(result.status)
        });
      })
    },
    async openHandler () {
      this.label = []
      this.onLableRender()
    },
    /**
     * 点击取消按钮触发
     * @param {Object} done
     */
    cancalHandler () {
      this.modalVisible = false
    },
    /**
     * 点击确认按钮触发
     * @param {Object} done
     * @param {Object} value
     */
    confirmHandler () {
      this.onLablePrint()
    },
    // 标签模版
    async createLabelTemplate (options, index) {
      var that = this
      // logo信息
      const logo = await _canvas.getImageInfo(options.logo);
 
      return new Promise((resolve) => {
        const ctx = uni.createCanvasContext(`label-canvas-${index}`);
        _canvas.clearCanvas(ctx, options.width, options.height);
        _canvas.fillRoundRect(ctx, 0, 0, options.width, options.height, 0, "#ffffff");
        // logo
        if (logo.path) {
          // 参数：cxt、图片属性、x坐标、y坐标、宽度、高度
          _canvas.drawImgCover(ctx, logo, options.padding, options.padding, logo.width, logo.height);
        }
        const baseFontConfig = {
          ctx: ctx,
          font: options.text.mainFontFamily,
          maxWidth: options.text.maxWidth,
          maxLine: options.text.maxLine,
          l_h: options.text.lineHeight,
          textCenter: options.text.textCenter
        }
        let [qrmatCode, qrcode, qrsupplier] = options.qrcodeText ? options.qrcodeText.split("|") : []
        // 箱号
        const cellCodeText = Object.assign({}, baseFontConfig, { word: '箱号：', x: uni.upx2px(25), y: uni.upx2px(160) })
        _canvas.dealWords(cellCodeText)
        // 箱号
        const cellCode = Object.assign({}, baseFontConfig, { word: qrmatCode, x: uni.upx2px(25), y: uni.upx2px(210) })
        _canvas.dealWords(cellCode)
        // 二维码
        _canvas.qrcodeCanvas2(ctx, options.qrcodeX, options.qrcodeY, options.qrcodeText, options.qrcodeSize, options.qrcodeSize);
        ctx.draw(true, function () {
          uni.canvasToTempFilePath({
            width: options.width,
            height: options.height,
            canvasId: `label-canvas-${index}`,
            success (res) {
              that.label.push(plus.io.convertLocalFileSystemURL(res.tempFilePath))
              resolve(plus.io.convertLocalFileSystemURL(res.tempFilePath))
            }
          }, that)
        })
      })
    },
    // 标签渲染
    async onLableRender () {
      this.labelConfigList.forEach(async (item, index) => {
        this.createLabelTemplate(item, index)
      })
    },
    // 标签打印
    async onLablePrint () {
      var that = this
      var printInfo = {
        contents: []
      }
      if (this.label.length) {
        this.label.forEach(item => {
          printInfo.contents.push(
            {
              type: "PIC", url: item, align: 'center'
            },
            { content: '' },
            { content: '' },
            { content: '' }
          )
        })
      }
      LySDKModulePrinter.transactionPrinter(printInfo, res => {
        that.result = JSON.stringify(res, null, 4);
        that.$emit('print')
      });
    }
  },
  onShow () { },
  onLoad () { },
  onHide () { },
  onUnload () { }
}
</script>
 
<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
 
.label-canvas {
  width: 580rpx;
  height: 500rpx;
  border: 1px solid #000;
  margin: 10rpx auto;
}
 
.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}
 
.x-print-content {
  position: relative;
  padding-bottom: 50px;
  padding-top: 12px;
 
}
</style>