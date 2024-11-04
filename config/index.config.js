const CONFIG = {
    // 开发环境配置
    development: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'http://test.smartscf.cn:8000',
        // baseUrl: 'http://10.10.14.20:80',
        // baseUrl: 'http://10.10.48.148:8069',
        // baseUrl: 'http://10.10.48.165:8026',
		db: 'gf_test',
        hostUrl: '', // H5地址(前端运行地址)
        weixinAppId: '' // 微信公众号appid
    },
    // 生产环境配置
    production: {
        assetsPath: '/static', // 静态资源路径
		// #ifdef H5
        baseUrl: '',
		// #endif
		// #ifndef H5
		baseUrl: 'http://10.10.14.20:80',
		// baseUrl: 'http://gf.smartscf.cn:8000',
		// baseUrl: 'http://test.smartscf.cn:8000',
		// #endif
		db: 'gf',
        hostUrl: '', // H5地址(前端运行地址)
        weixinAppId: '' // 微信公众号appid
    }

};
export default CONFIG[process.env.NODE_ENV];
