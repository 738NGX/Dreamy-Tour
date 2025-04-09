/*! *****************************************************************************
Copyright (c) 2025 Tencent, Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
***************************************************************************** */

type IAnyObject = Record<string, any>
interface IdaasError {
    /** 错误信息
     *
     * | 错误码 | 错误信息 | 说明 |
     * | - | - | - |
     * | 0 | ok | 正常 |
     * | -1 | system error | 系统错误 |
     * | 10001005 | miniapp does not open idaas service | 多端应用未接入身份管理 |
     * | 10001006 | verify code error | 验证码错误 |
     * | 10001007 | miniapp does not bound to weixin mobile application | 多端应用未绑定移动应用 |
     * | 10001008 | miniapp does not bound to weixin miniprogram | 多端应用未绑定开发小程序 |
     * | 10001009 | Apple sign-in not configured | Apple 登录未配置 |
     * | 10001010 | Apple sign-in configuration error | Apple 登录配置错误 |
     * | 10001011 | system login status is invalid | 系统登录态无效 |
     * | 10001014 | login verification failed, please check whether the weixin miniprogram login is completed. | 登录校验失败，请检查是否完成唤起微信小程序登录 |
     * | 10001015 | miniapp fails bounding to weixin mobile application | 多端应用绑定移动应用错误 |
     * | 10001016 | miniapp fails bounding to weixin miniprogram | 多端应用模块绑定开发小程序错误 |
     * | 10001020 | requesting Apple service failed, please try again later | 请求Apple服务失败, 请稍后重试 |
     * | 10001023 | mobile phone number already exists, binding failed | 手机号已存在, 绑定失败 |
     * | 10001036 | weixin account already exists, binding failed | 微信已存在, 绑定失败 |
     * | 10001037 | apple account already exists, binding failed | 苹果账号已存在, 绑定失败 |
     * | -700000 | front-end error | 前端错误，errMsg 将给出详细提示 | */
    errMsg: string
    /** 错误码
     *
     * | 错误码 | 错误信息 | 说明 |
     * | - | - | - |
     * | 0 | ok | 正常 |
     * | -1 | system error | 系统错误 |
     * | 10001005 | miniapp does not open idaas service | 多端应用未接入身份管理 |
     * | 10001006 | verify code error | 验证码错误 |
     * | 10001007 | miniapp does not bound to weixin mobile application | 多端应用未绑定移动应用 |
     * | 10001008 | miniapp does not bound to weixin miniprogram | 多端应用未绑定开发小程序 |
     * | 10001009 | Apple sign-in not configured | Apple 登录未配置 |
     * | 10001010 | Apple sign-in configuration error | Apple 登录配置错误 |
     * | 10001011 | system login status is invalid | 系统登录态无效 |
     * | 10001014 | login verification failed, please check whether the weixin miniprogram login is completed. | 登录校验失败，请检查是否完成唤起微信小程序登录 |
     * | 10001015 | miniapp fails bounding to weixin mobile application | 多端应用绑定移动应用错误 |
     * | 10001016 | miniapp fails bounding to weixin miniprogram | 多端应用模块绑定开发小程序错误 |
     * | 10001020 | requesting Apple service failed, please try again later | 请求Apple服务失败, 请稍后重试 |
     * | 10001023 | mobile phone number already exists, binding failed | 手机号已存在, 绑定失败 |
     * | 10001036 | weixin account already exists, binding failed | 微信已存在, 绑定失败 |
     * | 10001037 | apple account already exists, binding failed | 苹果账号已存在, 绑定失败 |
     * | -700000 | front-end error | 前端错误，errMsg 将给出详细提示 | */ errCode: number
}

interface WeixinAppLoginOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: WeixinAppLoginCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: WeixinAppLoginFailCallback
    /** 接口调用成功的回调函数 */
    success?: WeixinAppLoginSuccessCallback
}

interface WeixinMiniProgramLoginOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: WeixinMiniProgramLoginCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: WeixinMiniProgramLoginFailCallback
    /** 指定授权完小程序跳转的页面 */
    redirectPath?: string
    /** 接口调用成功的回调函数 */
    success?: WeixinMiniProgramLoginSuccessCallback
}

type WeixinMiniProgramLoginCompleteCallback = (res: IdaasError) => void
type WeixinMiniProgramLoginFailCallback = (res: IdaasError) => void
type WeixinMiniProgramLoginSuccessCallback = (
    result: WeixinAppLoginSuccessCallbackResult
) => void

interface WeixinAppLoginSuccessCallbackResult {
    /** 用户登录凭证（有效期五分钟）。开发者可以在开发者服务器调用 code2Verifyinfo，使用 code 换取用户标识信息等。注意 code2Verifyinfo 用的是多端应用 appid 和secret，不是小程序的 appid 和 secret，也不是移动应用的 appid 和 secret */
    code: string
    errMsg: string
}

type WeixinAppLoginSuccessCallback = (
    result: WeixinAppLoginSuccessCallbackResult
) => void
type WeixinAppLoginCompleteCallback = (res: IdaasError) => void
type WeixinAppLoginFailCallback = (res: IdaasError) => void

interface GetMiniProgramCodeOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GetMiniProgramCodeCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GetMiniProgramCodeFailCallback
    /** 接口调用成功的回调函数 */
    success?: GetMiniProgramCodeSuccessCallback
}

type GetMiniProgramCodeCompleteCallback = (res: IdaasError) => void
/** 接口调用失败的回调函数 */
type GetMiniProgramCodeFailCallback = (res: IdaasError) => void
/** 接口调用成功的回调函数 */
type GetMiniProgramCodeSuccessCallback = (
    result: GetMiniProgramCodeSuccessCallbackResult
) => void

interface GetMiniProgramCodeSuccessCallbackResult {
    /** 用户登录凭证（有效期五分钟）。开发者可以在开发者服务器调用code2Session，获取到 openid、unionid 等信息 */
    code: string
    errMsg: string
}

interface PhoneSmsLoginOption {
    /** 手机号 */
    phoneNumber: string
    /** 验证码: 6位纯数字组成的字符串 */
    verifyCode: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: PhoneSmsLoginCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: PhoneSmsLoginFailCallback
    /** 接口调用成功的回调函数 */
    success?: PhoneSmsLoginSuccessCallback
}

type PhoneSmsLoginCompleteCallback = (res: IdaasError) => void
/** 接口调用失败的回调函数 */
type PhoneSmsLoginFailCallback = (res: IdaasError) => void
/** 接口调用成功的回调函数 */
type PhoneSmsLoginSuccessCallback = (
    result: PhoneSmsLoginSuccessCallbackResult
) => void

interface PhoneSmsLoginSuccessCallbackResult {
    /** 用户登录凭证（有效期五分钟）。开发者可以在开发者服务器调用 code2Verifyinfo，使用 code 换取用户标识信息等 */
    code: string
    errMsg: string
}

interface GetPhoneMaskOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GetPhoneMaskCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GetPhoneMaskFailCallback
    /** 接口调用成功的回调函数 */
    success?: GetPhoneMaskSuccessCallback
}

type GetPhoneMaskCompleteCallback = (res: IdaasError) => void
/** 接口调用失败的回调函数 */
type GetPhoneMaskFailCallback = (res: IdaasError) => void
/** 接口调用成功的回调函数 */
type GetPhoneMaskSuccessCallback = (
    res: IAnyObject,
    /** 手机号掩码：137****1234 */
    phoneMask: string
) => void

interface AppleLoginOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: AppleLoginCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: AppleLoginFailCallback
    /** 接口调用成功的回调函数 */
    success?: AppleLoginSuccessCallback
}

type AppleLoginCompleteCallback = (res: IdaasError) => void
/** 接口调用失败的回调函数 */
type AppleLoginFailCallback = (res: IdaasError) => void
/** 接口调用成功的回调函数 */
type AppleLoginSuccessCallback = (
    res: IAnyObject,
    /** 用户登录凭证（有效期五分钟）。开发者可以在开发者服务器调用 code2Verifyinfo，使用 code 换取用户标识信息等 */
    code: string
) => void
type CheckIdentitySessionCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type CheckIdentitySessionFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type CheckIdentitySessionSuccessCallback = (res: GeneralCallbackResult) => void

interface CheckIdentitySessionOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: CheckIdentitySessionCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: CheckIdentitySessionFailCallback
    /** 接口调用成功的回调函数 */
    success?: CheckIdentitySessionSuccessCallback
}

interface GetIdentityCodeOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GetIdentityCodeCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GetIdentityCodeFailCallback
    /** 接口调用成功的回调函数 */
    success?: GetIdentityCodeSuccessCallback
}

type GetIdentityCodeCompleteCallback = (res: IdaasError) => void
/** 接口调用失败的回调函数 */
type GetIdentityCodeFailCallback = (res: IdaasError) => void
/** 接口调用成功的回调函数 */
type GetIdentityCodeSuccessCallback = (
    result: PhoneSmsLoginSuccessCallbackResult
) => void

interface LogoutOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: LogoutCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: LogoutFailCallback
    /** 接口调用成功的回调函数 */
    success?: LogoutSuccessCallback
}

type LogoutCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type LogoutFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type LogoutSuccessCallback = (res: GeneralCallbackResult) => void
declare namespace WechatMiniprogram {
    // 添加新的属性
    interface Wx {
        miniapp: WxMiniApp

        weixinAppLogin(option?: WeixinAppLoginOption): void

        weixinMiniProgramLogin(option: WeixinMiniProgramLoginOption): void

        getMiniProgramCode(option?: GetMiniProgramCodeOption): void

        phoneSmsLogin(option: PhoneSmsLoginOption): void

        getPhoneMask(option?: GetPhoneMaskOption): void

        appleLogin(option?: AppleLoginOption): void

        checkIdentitySession(option?: CheckIdentitySessionOption): void

        getIdentityCode(option?: GetIdentityCodeOption): void

        logout(option?: LogoutOption): void
    }
}

interface AddPaymentByProductIdentifiersOption {
    /** "A string that associates the transaction with a user account on your service" */
    applicationUsername: string
    /** "The details of the discount offer to apply to the payment." */
    discount: DiscountOption
    /** "A string that identifies a product that can be purchased from within your app." */
    productIdentifier: string
    /** "The number of items the user wants to purchase." */
    quantity: number
    /** "A Boolean value that produces an “ask to buy” flow for this payment in the sandbox." */
    simulatesAskToBuyInSandbox: boolean
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: AddPaymentByProductIdentifiersCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: AddPaymentByProductIdentifiersFailCallback
    /** 接口调用成功的回调函数 */
    success?: AddPaymentByProductIdentifiersSuccessCallback
}
interface AddTransactionObserverOption {
    /** 对应苹果支付的paymentQueue:didRevokeEntitlementsForProductIdentifiers: */
    didRevokeEntitlementsForProductIdentifiers?: (...args: any[]) => any
    /** 对应苹果支付的paymentQueue:paymentQueueDidChangeStorefront: */
    paymentQueueDidChangeStorefront?: (...args: any[]) => any
    /** 对应苹果支付的paymentQueue:paymentQueueRestoreCompletedTransactionsFinished: */
    paymentQueueRestoreCompletedTransactionsFinished?: (...args: any[]) => any
    /** 对应苹果支付的paymentQueue:restoreCompletedTransactionsFailedWithError: */
    restoreCompletedTransactionsFailedWithError?: (...args: any[]) => any
    /** 对应苹果支付的paymentQueue:shouldAddStorePayment: */
    shouldAddStorePayment?: (...args: any[]) => any
    /** 对应苹果支付的paymentQueue:updatedTransactions: */
    updatedTransactions?: (...args: any[]) => any
}
interface AgreePrivacyAuthorizationOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: AgreePrivacyAuthorizationCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: AgreePrivacyAuthorizationFailCallback
    /** 接口调用成功的回调函数 */
    success?: AgreePrivacyAuthorizationSuccessCallback
}
interface BindAppleOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: BindAppleCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: BindAppleFailCallback
    /** 接口调用成功的回调函数 */
    success?: BindAppleSuccessCallback
}
interface BindPhoneOption {
    /** 手机号 */
    phoneNumber: string
    /** 验证码: 6位纯数字组成的字符串 */
    verifyCode: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: BindPhoneCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: BindPhoneFailCallback
    /** 接口调用成功的回调函数 */
    success?: BindPhoneSuccessCallback
}
interface BindWeixinOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: BindWeixinCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: BindWeixinFailCallback
    /** 接口调用成功的回调函数 */
    success?: BindWeixinSuccessCallback
}
interface CanMakePaymentsOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: CanMakePaymentsCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: CanMakePaymentsFailCallback
    /** 接口调用成功的回调函数 */
    success?: CanMakePaymentsSuccessCallback
}
interface CheckBindInfoOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: CheckBindInfoCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: CheckBindInfoFailCallback
    /** 接口调用成功的回调函数 */
    success?: CheckBindInfoSuccessCallback
}
interface CheckBindInfoSuccessCallbackResult {
    /** 当前用户是否已经绑定苹果账号 */
    hasBoundApple: boolean
    /** 当前用户是否已经绑定手机号 */
    hasBoundPhone: boolean
    /** 当前用户是否已经绑定微信 */
    hasBoundWeixin: boolean
    errMsg: string
}
/** 返回选择的文件的本地临时文件对象数组 */
interface ChooseFile {
    /** 本地文件名称 */
    name: string
    /** 本地文件临时路径，形如 wxfile://tmp_xxxxx.jpg */
    path: string
    /** 本地临时文件大小，单位 B */
    size: number
}
interface ChooseFileOption {
    /** 是否允许用户选择多个文件 */
    allowsMultipleSelection?: boolean
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: ChooseFileCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: ChooseFileFailCallback
    /** 接口调用成功的回调函数 */
    success?: ChooseFileSuccessCallback
}
interface ChooseFileSuccessCallbackResult {
    /** 返回选择的文件的本地临时文件对象数组 */
    tempFiles: ChooseFile[]
    errMsg: string
}
interface CloseAppModuleOption {
    /** 是否仅退入后台,保持后台运行，默认否，直接将小程序杀死。 */
    allowBackgroundRunning?: boolean
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: CloseAppModuleCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: CloseAppModuleFailCallback
    /** 接口调用成功的回调函数 */
    success?: CloseAppModuleSuccessCallback
}
interface CloseAppOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: CloseAppCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: CloseAppFailCallback
    /** 接口调用成功的回调函数 */
    success?: CloseAppSuccessCallback
}
interface CopyNativeFileToWxOption {
    nativeFilePath: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: CopyNativeFileToWxCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: CopyNativeFileToWxFailCallback
    /** 接口调用成功的回调函数 */
    success?: CopyNativeFileToWxSuccessCallback
}
interface CopyWxFileToNativeOption {
    wxFilePath: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: CopyWxFileToNativeCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: CopyWxFileToNativeFailCallback
    /** 接口调用成功的回调函数 */
    success?: CopyWxFileToNativeSuccessCallback
}
interface CreateRewardedVideoAdOption {
    /** 广告单元 id */
    adUnitId: string
}
/** "The details of the discount offer to apply to the payment." */
interface DiscountOption {
    /** "A string used to uniquely identify a discount offer for a product." */
    identifier: string
    /** "A string that identifies the key used to generate the signature." */
    keyIdentifier: string
    /** "A universally unique ID (UUID) value that you define." */
    nonce: string
    /** "A string representing the properties of a specific promotional offer, cryptographically signed." */
    signature: string
    /** "The date and time of the signature's creation in milliseconds, formatted in Unix epoch time." */
    timestamp: string
}
interface FinishTransactionOption {
    /** 交易id */
    transactionIdentifier: any[]
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: FinishTransactionCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: FinishTransactionFailCallback
    /** 接口调用成功的回调函数 */
    success?: FinishTransactionSuccessCallback
}
interface GetAppStoreReceiptDataOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GetAppStoreReceiptDataCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GetAppStoreReceiptDataFailCallback
    /** 接口调用成功的回调函数 */
    success?: GetAppStoreReceiptDataSuccessCallback
}
interface GetAppStoreReceiptURLOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GetAppStoreReceiptURLCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GetAppStoreReceiptURLFailCallback
    /** 接口调用成功的回调函数 */
    success?: GetAppStoreReceiptURLSuccessCallback
}
interface GetMetaDataOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GetMetaDataCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GetMetaDataFailCallback
    /** 接口调用成功的回调函数 */
    success?: GetMetaDataSuccessCallback
}
interface GetPrivacySettingOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GetPrivacySettingCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GetPrivacySettingFailCallback
    /** 接口调用成功的回调函数 */
    success?: GetPrivacySettingSuccessCallback
}
interface GetSDKVersionOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GetSDKVersionCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GetSDKVersionFailCallback
    /** 接口调用成功的回调函数 */
    success?: GetSDKVersionSuccessCallback
}
interface GetStorefrontOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GetStorefrontCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GetStorefrontFailCallback
    /** 接口调用成功的回调函数 */
    success?: GetStorefrontSuccessCallback
}
interface GetTransactionsOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GetTransactionsCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GetTransactionsFailCallback
    /** 接口调用成功的回调函数 */
    success?: GetTransactionsSuccessCallback
}
interface GoogleLoginOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GoogleLoginCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GoogleLoginFailCallback
    /** 接口调用成功的回调函数 */
    success?: GoogleLoginSuccessCallback
}
interface GoogleLoginSuccessCallbackResult {
    /** 用户 Token */
    idToken: string
    /** 用户 ID */
    userID: string
    errMsg: string
}
interface GoogleLogoutOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GoogleLogoutCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GoogleLogoutFailCallback
    /** 接口调用成功的回调函数 */
    success?: GoogleLogoutSuccessCallback
}
interface GoogleRestoreLoginOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: GoogleRestoreLoginCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: GoogleRestoreLoginFailCallback
    /** 接口调用成功的回调函数 */
    success?: GoogleRestoreLoginSuccessCallback
}
interface HasWechatInstallOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: HasWechatInstallCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: HasWechatInstallFailCallback
    /** 接口调用成功的回调函数 */
    success?: HasWechatInstallSuccessCallback
}
interface HideStatusBarOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: HideStatusBarCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: HideStatusBarFailCallback
    /** 接口调用成功的回调函数 */
    success?: HideStatusBarSuccessCallback
}
interface InstallAppOption {
    /** APK 文件路径，可以是临时文件路径或永久文件路径 (本地路径) ，不支持网络路径 */
    filePath: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: InstallAppCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: InstallAppFailCallback
    /** 接口调用成功的回调函数 */
    success?: InstallAppSuccessCallback
}
interface JumpToAppStoreOption {
    action?: 'write-review'
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: JumpToAppStoreCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: JumpToAppStoreFailCallback
    /** 接口调用成功的回调函数 */
    success?: JumpToAppStoreSuccessCallback
}
interface JumpToGooglePlayOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: JumpToGooglePlayCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: JumpToGooglePlayFailCallback
    /** 接口调用成功的回调函数 */
    success?: JumpToGooglePlaySuccessCallback
}
interface LaunchMiniProgramOption {
    /** 小程序类型, 正式版:0, 开发版:1, 体验版:2 */
    miniProgramType: 0 | 1 | 2
    /** 小程序账号原始ID */
    userName: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: LaunchMiniProgramCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: LaunchMiniProgramFailCallback
    /** 页面路径 */
    path?: string
    /** 接口调用成功的回调函数 */
    success?: LaunchMiniProgramSuccessCallback
}
interface LoadNativePluginOption {
    /** 多端插件 id */
    pluginId: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: LoadNativePluginCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: LoadNativePluginFailCallback
    /** 接口调用成功的回调函数 */
    success?: LoadNativePluginSuccessCallback
}
interface LoginOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: LoginCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: LoginFailCallback
    /** 接口调用成功的回调函数 */
    success?: LoginSuccessCallback
}
/** 开屏广告失败监听回调 */
interface OffAdSplashErrorFunction {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: OffAdSplashErrorCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: OffAdSplashErrorFailCallback
    /** 接口调用成功的回调函数 */
    success?: OffAdSplashErrorSuccessCallback
}
/** 日志监听回调 */
interface OffOpensdkLogFunction {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: OffOpensdkLogCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: OffOpensdkLogFailCallback
    /** 接口调用成功的回调函数 */
    success?: OffOpensdkLogSuccessCallback
}
/** 开屏广告失败监听回调 */
interface OnAdSplashErrorFunction {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: OnAdSplashErrorCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: OnAdSplashErrorFailCallback
    /** 接口调用成功的回调函数 */
    success?: OnAdSplashErrorSuccessCallback
}
/** 日志监听回调 */
interface OnOpensdkLogFunction {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: OnOpensdkLogCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: OnOpensdkLogFailCallback
    /** 接口调用成功的回调函数 */
    success?: OnOpensdkLogSuccessCallback
}
interface OpenAppStoreRatingOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: OpenAppStoreRatingCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: OpenAppStoreRatingFailCallback
    /** 接口调用成功的回调函数 */
    success?: OpenAppStoreRatingSuccessCallback
}
interface OpenCustomerServiceChatOption {
    /** 企业id 开发者需前往微信客服官网完成移动应用(appid)和企业id的绑定 */
    corpId: string
    /** 客服URL */
    url: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: OpenCustomerServiceChatCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: OpenCustomerServiceChatFailCallback
    /** 接口调用成功的回调函数 */
    success?: OpenCustomerServiceChatSuccessCallback
}
interface OpenSaaAActionSheetOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: OpenSaaAActionSheetCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: OpenSaaAActionSheetFailCallback
    /** 接口调用成功的回调函数 */
    success?: OpenSaaAActionSheetSuccessCallback
}
interface OpenUrlOption {
    /** 跳转的目标 App 路径，该参数的 Scheme 的前缀需与在多端应用控制台配置的一致 */
    url: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: OpenUrlCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: OpenUrlFailCallback
    /** 接口调用成功的回调函数 */
    success?: OpenUrlSuccessCallback
}
interface RequestPaymentOption {
    /** 商户号 */
    mchid: string
    /** 随机字符串，长度为32个字符以下 */
    nonceStr: string
    /** 随机字符串，暂填写固定值Sign=WXPay */
    package: string
    /** 预支付交易会话 ID */
    prepayId: string
    /** 签名；注意：签名方式一定要与统一下单接口使用的一致，仅支持 V3 的签名 */
    sign: string
    /** 时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间 */
    timeStamp: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: RequestPaymentCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: RequestPaymentFailCallback
    /** 接口调用成功的回调函数 */
    success?: RequestPaymentSuccessCallback
}
interface RequestSKProductsOption {
    /** 需要获取商品 productIdentifiers 的字符串数组 */
    productIdentifiers: any[]
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: RequestSKProductsCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: RequestSKProductsFailCallback
    /** 接口调用成功的回调函数 */
    success?: RequestSKProductsSuccessCallback
}
interface RequestSKReceiptRefreshRequestOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: RequestSKReceiptRefreshRequestCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: RequestSKReceiptRefreshRequestFailCallback
    /** 接口调用成功的回调函数 */
    success?: RequestSKReceiptRefreshRequestSuccessCallback
}
interface RequestSubscribeMessageOption {
    /** 用于保持请求和回调的状态，授权请后原样带回给第三方。该参数可用于防止 csrf 攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加 session 进行校验，开发者可以填写 a-zA-Z0-9 的参数值，最多 128 字节，要求做 urlencode */
    reserved: string
    /** 发送的目标场景,0=分享到会话,1=分享到朋友圈，2=分享到收藏
     *
     * 可选值：
     * - 0: 分享到会话;
     * - 1: 分享到朋友圈;
     * - 2: 分享到收藏; */
    scene: 0 | 1 | 2
    /** 订阅消息模板 ID，在微信开放平台提交应用审核通过后获得。查看模板id的路径为：微信开放平台 - 移动应用 - 能力专区 - 一次性订阅消息 */
    templateId: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: RequestSubscribeMessageCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: RequestSubscribeMessageFailCallback
    /** 接口调用成功的回调函数 */
    success?: RequestSubscribeMessageSuccessCallback
}
interface RestoreCompletedTransactionsOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: RestoreCompletedTransactionsCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: RestoreCompletedTransactionsFailCallback
    /** 接口调用成功的回调函数 */
    success?: RestoreCompletedTransactionsSuccessCallback
}
interface RevokePrivacySettingOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: RevokePrivacySettingCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: RevokePrivacySettingFailCallback
    /** 接口调用成功的回调函数 */
    success?: RevokePrivacySettingSuccessCallback
}
interface SetEnableAdSplashOption {
    enable: boolean
}
interface SetSaaAUserIdOption {
    userId: string
}
interface ShareFileOption {
    /** 文件路径，可以是临时文件路径或永久文件路径 (本地路径) ，不支持网络路径 */
    filePath: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: ShareFileCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: ShareFileFailCallback
    /** 接口调用成功的回调函数 */
    success?: ShareFileSuccessCallback
}
interface ShareImageMessageOption {
    /** 分享图片，支持代码包图片资源路径或者本地临时、缓存、用户文件；不支持网络图片路径 */
    imagePath: string
    /** 发送的目标场景,0=分享到会话,1=分享到朋友圈，2=分享到收藏
     *
     * 可选值：
     * - 0: 分享到会话;
     * - 1: 分享到朋友圈;
     * - 2: 分享到收藏; */
    scene: 0 | 1 | 2
    /** 分享缩略图，支持代码包图片资源路径或者本地临时、缓存、用户文件；不支持网络图片路径 */
    thumbPath: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: ShareImageMessageCompleteCallback
    /** 启动小程路径；iOS SDK >=1.3.36；Android SDK >=1.3.26 */
    entranceMiniProgramPath?: string
    /** 启动小程序username（小程序的原始id，gh_xxx）；iOS SDK >=1.3.36；Android SDK >=1.3.26 */
    entranceMiniProgramUsername?: string
    /** 接口调用失败的回调函数 */
    fail?: ShareImageMessageFailCallback
    /** 接口调用成功的回调函数 */
    success?: ShareImageMessageSuccessCallback
}
interface ShareMiniProgramMessageOption {
    /** 分享小程序相关缩略图，支持代码包图片资源路径或者本地临时、缓存、用户文件；不支持网络图片路径 */
    imagePath: string
    /** 0-正式版，1-开发版，2-体验版 */
    miniprogramType: number
    /** 小程序页面路径；对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar" */
    path: string
    /** 发送的目标场景,只支持会话，0=分享到会话
     *
     * 可选值：
     * - 0: 分享到会话; */
    scene: 0
    /** 小程序原始ID，如 gh_d4xxxxxxca31f */
    userName: string
    /** 兼容低版本的网页链接 url */
    webpageUrl: string
    /** 通常开发者希望分享出去的小程序被二次打开时可以获取到更多信息，例如群的标识。可以设置 withShareTicket 为 true，当分享卡片在群聊中被其他用户打开时，可以获取到 shareTicket，用于获取更多分享信息。详见小程序获取更多分享信息 ，最低客户端版本要求：6.5.13 */
    withShareTicket: boolean
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: ShareMiniProgramMessageCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: ShareMiniProgramMessageFailCallback
    /** 接口调用成功的回调函数 */
    success?: ShareMiniProgramMessageSuccessCallback
}
interface ShareTextMessageOption {
    /** 发送的目标场景,0=分享到会话,1=分享到朋友圈，2=分享到收藏
     *
     * 可选值：
     * - 0: 分享到会话;
     * - 1: 分享到朋友圈;
     * - 2: 分享到收藏; */
    scene: 0 | 1 | 2
    /** 分享的文本 */
    text: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: ShareTextMessageCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: ShareTextMessageFailCallback
    /** 接口调用成功的回调函数 */
    success?: ShareTextMessageSuccessCallback
}
interface ShareVideoMessageOption {
    /** 网页描述 */
    description: string
    /** 发送的目标场景,0=分享到会话,1=分享到朋友圈，2=分享到收藏
     *
     * 可选值：
     * - 0: 分享到会话;
     * - 1: 分享到朋友圈;
     * - 2: 分享到收藏; */
    scene: 0 | 1 | 2
    /** 分享缩略图，支持代码包图片资源路径或者本地临时、缓存、用户文件；不支持网络图片路径 */
    thumbPath: string
    /** 网页标题 */
    title: string
    /** 供低带宽的环境下使用的视频链接，限制长度不超过 10KB */
    videoLowBandUrl: string
    /** 视频链接 url， 限制长度不超过 10KB */
    videoUrl: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: ShareVideoMessageCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: ShareVideoMessageFailCallback
    /** 接口调用成功的回调函数 */
    success?: ShareVideoMessageSuccessCallback
}
interface ShareWebPageMessageOption {
    /** 网页描述 */
    description: string
    /** 发送的目标场景,0=分享到会话,1=分享到朋友圈，2=分享到收藏
     *
     * 可选值：
     * - 0: 分享到会话;
     * - 1: 分享到朋友圈;
     * - 2: 分享到收藏; */
    scene: 0 | 1 | 2
    /** 分享缩略图，支持代码包图片资源路径或者本地临时、缓存、用户文件；不支持网络图片路径 */
    thumbPath: string
    /** 网页标题 */
    title: string
    /** 分享 webpage url */
    webpageUrl: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: ShareWebPageMessageCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: ShareWebPageMessageFailCallback
    /** 接口调用成功的回调函数 */
    success?: ShareWebPageMessageSuccessCallback
}
interface ShowStatusBarOption {
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: ShowStatusBarCompleteCallback
    /** 接口调用失败的回调函数 */
    fail?: ShowStatusBarFailCallback
    /** 接口调用成功的回调函数 */
    success?: ShowStatusBarSuccessCallback
}
interface IdaasError {
    /** 错误信息
     *
     * | 错误码 | 错误信息 | 说明 |
     * | - | - | - |
     * | 0 | ok | 正常 |
     * | -1 | system error | 系统错误 |
     * | 10001005 | miniapp does not open idaas service | 多端应用未接入身份管理 |
     * | 10001006 | verify code error | 验证码错误 |
     * | 10001007 | miniapp does not bound to weixin mobile application | 多端应用未绑定移动应用 |
     * | 10001008 | miniapp does not bound to weixin miniprogram | 多端应用未绑定开发小程序 |
     * | 10001009 | Apple sign-in not configured | Apple 登录未配置 |
     * | 10001010 | Apple sign-in configuration error | Apple 登录配置错误 |
     * | 10001011 | system login status is invalid | 系统登录态无效 |
     * | 10001014 | login verification failed, please check whether the weixin miniprogram login is completed. | 登录校验失败，请检查是否完成唤起微信小程序登录 |
     * | 10001015 | miniapp fails bounding to weixin mobile application | 多端应用绑定移动应用错误 |
     * | 10001016 | miniapp fails bounding to weixin miniprogram | 多端应用模块绑定开发小程序错误 |
     * | 10001020 | requesting Apple service failed, please try again later | 请求Apple服务失败, 请稍后重试 |
     * | 10001023 | mobile phone number already exists, binding failed | 手机号已存在, 绑定失败 |
     * | 10001036 | weixin account already exists, binding failed | 微信已存在, 绑定失败 |
     * | 10001037 | apple account already exists, binding failed | 苹果账号已存在, 绑定失败 |
     * | -700000 | front-end error | 前端错误，errMsg 将给出详细提示 | */ errMsg: string
    /** 错误码
     *
     * | 错误码 | 错误信息 | 说明 |
     * | - | - | - |
     * | 0 | ok | 正常 |
     * | -1 | system error | 系统错误 |
     * | 10001005 | miniapp does not open idaas service | 多端应用未接入身份管理 |
     * | 10001006 | verify code error | 验证码错误 |
     * | 10001007 | miniapp does not bound to weixin mobile application | 多端应用未绑定移动应用 |
     * | 10001008 | miniapp does not bound to weixin miniprogram | 多端应用未绑定开发小程序 |
     * | 10001009 | Apple sign-in not configured | Apple 登录未配置 |
     * | 10001010 | Apple sign-in configuration error | Apple 登录配置错误 |
     * | 10001011 | system login status is invalid | 系统登录态无效 |
     * | 10001014 | login verification failed, please check whether the weixin miniprogram login is completed. | 登录校验失败，请检查是否完成唤起微信小程序登录 |
     * | 10001015 | miniapp fails bounding to weixin mobile application | 多端应用绑定移动应用错误 |
     * | 10001016 | miniapp fails bounding to weixin miniprogram | 多端应用模块绑定开发小程序错误 |
     * | 10001020 | requesting Apple service failed, please try again later | 请求Apple服务失败, 请稍后重试 |
     * | 10001023 | mobile phone number already exists, binding failed | 手机号已存在, 绑定失败 |
     * | 10001036 | weixin account already exists, binding failed | 微信已存在, 绑定失败 |
     * | 10001037 | apple account already exists, binding failed | 苹果账号已存在, 绑定失败 |
     * | -700000 | front-end error | 前端错误，errMsg 将给出详细提示 | */ errCode: number
}
interface RewardedVideoAd {
    /** [Promise RewardedVideoAd.load()](RewardedVideoAd.load.md)
     *
     * 加载激励视频广告。 */
    load(): Promise<any>
    /** [Promise RewardedVideoAd.show()](RewardedVideoAd.show.md)
     *
     * 显示激励视频广告。 */
    show(): Promise<any>
    /** [RewardedVideoAd.destroy()](RewardedVideoAd.destroy.md)
     *
     * 销毁激励视频广告实例。 */
    destroy(): void
}
interface WxMiniApp {
    /** [[RewardedVideoAd]((RewardedVideoAd)) wx.miniapp.createRewardedVideoAd(Object object)](wx.miniapp.createRewardedVideoAd.md)
*
* 创建激励视频广告组件。调用该方法创建的激励视频广告是一个单例。
*
* **示例代码**
*
* ```js
const rewardedVideoAd = wx.miniapp.createRewardedVideoAd({ adUnitId: 'xxxx' })
rewardedVideoAd.onLoad(() => {
  console.log('onLoad event emit')
})
rewardedVideoAd.onError((err) => {
  console.log('onError event emit', err)
})
rewardedVideoAd.onClose((res) => {
  console.log('onClose event emit', res)
})
``` */
    createRewardedVideoAd(option: CreateRewardedVideoAdOption): RewardedVideoAd
    /** [wx.miniapp.agreePrivacyAuthorization(Object object)](wx.miniapp.agreePrivacyAuthorization.md)
*
* 用户同意了隐私协议
*
* **示例代码**
*
* ```js
wx.miniapp.agreePrivacyAuthorization({
  success(res) {
    console.log('agreePrivacyAuthorization success')
  },
  fail(res) {
    console.error('agreePrivacyAuthorization fail', res)
  }
})
``` */
    agreePrivacyAuthorization(option?: AgreePrivacyAuthorizationOption): void
    /** [wx.miniapp.bindApple(Object object)](wx.miniapp.bindApple.md)
*
* 在系统登录态生效期间，调用接口绑定苹果账号
*
* **示例代码**
*
* ```js
wx.miniapp.bindApple({
  success(res) {
    // 绑定成功
  }
})
``` */
    bindApple(option?: BindAppleOption): void
    /** [wx.miniapp.bindPhone(Object object)](wx.miniapp.bindPhone.md)
*
* 在系统登录态生效期间，调用接口绑定手机号
*
* **示例代码**
*
* ```js
wx.miniapp.bindPhone({
  phoneNumber: 'xxx', // 手机号
  verifyCode: 'xxx', // 验证码
  success(res) {
    // 绑定成功
  }
})
``` */
    bindPhone(option: BindPhoneOption): void
    /** [wx.miniapp.bindWeixin(Object object)](wx.miniapp.bindWeixin.md)
*
* 在系统登录态生效期间，调用接口唤起用户的微信 APP 进行绑定微信
*
* **示例代码**
*
* ```js
wx.miniapp.bindWeixin({
  success(res) {
    // 绑定成功
  }
})
``` */
    bindWeixin(option?: BindWeixinOption): void
    /** [wx.miniapp.checkBindInfo(Object object)](wx.miniapp.checkBindInfo.md)
*
* 在系统登录态生效期间，调用接口检查当前用户账号绑定信息
*
* **示例代码**
*
* ```js
wx.miniapp.checkBindInfo({
  success(res) {
    if(res.hasBoundPhone) {
      // 已经绑定手机号
    } else {
      // 没有绑定手机号。开发者可以根据业务需要，调用 wx.miniapp.bindPhone 绑定手机号。
    }

    if(res.hasBoundWeixin) {
      // 已经绑定微信
    } else {
      // 没有绑定微信。开发者可以根据业务需要，调用 wx.miniapp.bindWeixin 绑定微信。
    }

    if(res.hasBoundApple) {
      // 已经绑定苹果账号
    } else {
      // 没有绑定苹果账号。开发者可以根据业务需要，调用 wx.miniapp.bindApple 绑定苹果账号。
    }
  }
})
``` */
    checkBindInfo(option?: CheckBindInfoOption): void
    /** [wx.miniapp.chooseFile(Object object)](wx.miniapp.chooseFile.md)
*
* 拉取系统文件选择框去选择文件
*
* **示例代码**
*
* ```js
wx.miniapp.chooseFile({
  allowsMultipleSelection: false,
  success (res) {
    // tempFilePath可以作为img标签的src属性显示图片
    const tempFilePaths = res.tempFiles
  }
})
``` */
    chooseFile(option: ChooseFileOption): void
    /** [wx.miniapp.closeApp(Object object)](wx.miniapp.closeApp.md)
*
* 关闭 APP
*
* **示例代码**
*
*  ```js
 wx.miniapp.closeApp({
  success () {
   console.log('成功')
  }
})
 ``` */
    closeApp(option: CloseAppOption): void
    /** [wx.miniapp.closeAppModule(Object object)](wx.miniapp.closeAppModule.md)
*
* 关闭 APP
*
* **示例代码**
*
*  ```js
 wx.miniapp.closeAppModule({
  allowBackgroundRunning: true,
  success () {
   console.log('成功')
  }
})
 ``` */
    closeAppModule<T extends CloseAppModuleOption = CloseAppModuleOption>(
        option: T
    ): PromisifySuccessResult<T, CloseAppModuleOption>
    /** [wx.miniapp.copyNativeFileToWx(Object object)](wx.miniapp.copyNativeFileToWx.md)
*
* 复制系统文件到 wx 目录里。
*
* **示例代码**
*
* ```js
wx.miniapp.copyNativeFileToWx({
       nativeFilePath: param.url,
       success(res) {
         console.log('copyNativeFileToWx success', res)
       },
       fail(e) {
         console.log('copyNativeFileToWx fail', e)
       }
     })
``` */
    copyNativeFileToWx(option: CopyNativeFileToWxOption): void
    /** [wx.miniapp.copyWxFileToNative(Object object)](wx.miniapp.copyWxFileToNative.md)
*
* 复制 wx 文件到系统目录里。
*
* **示例代码**
*
* ```js
wx.miniapp.copyWxFileToNative({
wxFilePath: param.url,
success(res) {
console.log('copyWxFileToNative success', res)
},
fail(e) {
console.log('copyWxFileToNative fail', e)
}
})
``` */
    copyWxFileToNative(option: CopyWxFileToNativeOption): void
    /** [wx.miniapp.getMetaData(Object object)](wx.miniapp.getMetaData.md)
*
* 查询用户自定义的meta-data，仅安卓支持
*
* **示例代码**
*
* ```js
wx.miniapp.getMetaData({
  success (res) {
    console.log('getMetaData success', res)
  }
})
``` */
    getMetaData(option?: GetMetaDataOption): void
    /** [wx.miniapp.getPrivacySetting(Object object)](wx.miniapp.getPrivacySetting.md)
*
* 查询隐私授权情况
*
* **示例代码**
*
* ```js
wx.miniapp.getPrivacySetting({
  success (res) {
    console.log('getPrivacySetting success', res)
    if (res.needAuthorization) {
      console.log('需要用户先同意隐私协议')
    } else {
      console.log('用户已经同意隐私协议了')
    }
  }
})
``` */
    getPrivacySetting(option?: GetPrivacySettingOption): void
    /** [wx.miniapp.getSDKVersion(Object object)](wx.miniapp.getSDKVersion.md)
*
* 获取 SDK 当前版本号
*
* **示例代码**
*
* ```js
wx.miniapp.getSDKVersion({
   success: (res) => {
       console.log('getSDKVersion success:', res)
   }
})
``` */
    getSDKVersion<T extends GetSDKVersionOption = GetSDKVersionOption>(
        option: T
    ): PromisifySuccessResult<T, GetSDKVersionOption>
    /** [wx.miniapp.googleLogin(Object object)](wx.miniapp.googleLogin.md)
*
* google 登录。
*
* **示例代码**
*
* ```js
wx.miniapp.googleLogin({
       success(res) {
         console.log('googleLogin success', res.userID)
         console.log('googleLogin success', res.idToken)
       },
       fail(e) {
         console.log('googleLogin fail', e)
       }
     })
``` */
    googleLogin(option?: GoogleLoginOption): void
    /** [wx.miniapp.googleLogout(Object object)](wx.miniapp.googleLogout.md)
*
* google 登出。
*
* **示例代码**
*
* ```js
wx.miniapp.googleLogout({
  success(res) {
    console.log('googleLogout success', res)
  },
  fail(e) {
    console.log('googleLogout fail', e)
  }
})
``` */
    googleLogout(option?: GoogleLogoutOption): void
    /** [wx.miniapp.googleRestoreLogin(Object object)](wx.miniapp.googleRestoreLogin.md)
*
* google 恢复登录。
*
* **示例代码**
*
* ```js
wx.miniapp.googleRestoreLogin({
  success(res) {
    console.log('googleRestoreLogin success', res.userID)
    console.log('googleRestoreLogin success', res.idToken)
  },
  fail(e) {
    console.log('googleLogin fail', e)
  }
})
``` */
    googleRestoreLogin(option?: GoogleRestoreLoginOption): void
    /** [wx.miniapp.hasWechatInstall(Object object)](wx.miniapp.hasWechatInstall.md)
*
* App 获取微信是否已经安装到手机
*
* **示例代码**
*
* ```js
wx.miniapp.hasWechatInstall({
  success: (res) => {
    console.warn('wx.miniapp.hasWechatInstall success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.hasWechatInstall res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.hasWechatInstall res:', res)
  }
})
``` */
    hasWechatInstall(option: HasWechatInstallOption): void
    /** [wx.miniapp.hideStatusBar(Object object)](wx.miniapp.hideStatusBar.md)
*
* 隐藏状态栏
*
* **示例代码**
*
* ```js
wx.miniapp.hideStatusBar()
``` */
    hideStatusBar(option?: HideStatusBarOption): void
    /** [wx.miniapp.installApp(Object object)](wx.miniapp.installApp.md)
*
* 安装 APK 文件。
*
* **示例代码**
*
* ```js
wx.miniapp.installApp({
  filePath: 'wxfile://',
  success(res) {
    console.log(res.errMsg)
  }
})
``` */
    installApp(option: InstallAppOption): void
    /** [wx.miniapp.jumpToAppStore(Object object)](wx.miniapp.jumpToAppStore.md)
*
* 跳转去苹果 App Store，可携带参数跳转评分页
*
* **示例代码**
*
* ```js
wx.miniapp.jumpToAppStore({
 action: "write-review"
})
``` */
    jumpToAppStore(option: JumpToAppStoreOption): void
    /** [wx.miniapp.jumpToGooglePlay(Object object)](wx.miniapp.jumpToGooglePlay.md)
*
* 跳转去 GooglePlay。
*
* **示例代码**
*
* ```js
wx.jumpToGooglePlay({
 success(res) {
   console.log(res)
 }
})
``` */
    jumpToGooglePlay(option?: JumpToGooglePlayOption): void
    /** [wx.miniapp.launchMiniProgram(Object object)](wx.miniapp.launchMiniProgram.md)
*
* App 拉起微信小程序
*
* **示例代码**
*
*  ```js
 wx.miniapp.launchMiniProgram({
  userName: 'xxxx',
  miniProgramType: 1,
  path: 'xxx',
  success(res) {
    console.log('launchMiniProgram success:', res)
  },
})
 ``` */
    launchMiniProgram<
        T extends LaunchMiniProgramOption = LaunchMiniProgramOption
    >(
        option: T
    ): PromisifySuccessResult<T, LaunchMiniProgramOption>
    /** [wx.miniapp.loadNativePlugin(Object object)](wx.miniapp.loadNativePlugin.md)
*
* 加载多端插件
*
* **示例代码**
*
* ```js
wx.miniapp.loadNativePlugin({
  pluginId: 'YOUR_PLUGIN_ID',
  success: (plugin) => {
      console.log('load plugin success')
      plugin.myAsyncFuncwithCallback({ a: 'hello', b: [1,2] }, (ret) => {
          console.log('myAsyncFuncwithCallback ret:', ret)
      })
  },
  fail: (e) => {
      console.log('load plugin fail', e)
  }
})
``` */
    loadNativePlugin(option: LoadNativePluginOption): void
    /** [wx.miniapp.login(Object object)](wx.miniapp.login.md)
*
* App 调起微信登录
*
* **示例代码**
*
* ```js
wx.miniapp.login({
  success: (res) => {
    console.warn('wx.miniapp.login success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.login res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.login res:', res)
  }
})
``` */
    login<T extends LoginOption = LoginOption>(
        option: T
    ): PromisifySuccessResult<T, LoginOption>
    /** [wx.miniapp.offAdSplashError(function fn)](wx.miniapp.offAdSplashError.md)
*
* 该能力可以取消对开屏广告失败监听回调
*
* **示例代码**
*
* ```js
const adSplashError = (e) => {
  console.log('adSplashError', e)
}

wx.miniapp.offAdSplashError(adSplashError)
``` */
    offAdSplashError(
        /** 开屏广告失败监听回调 */
        fn: OffAdSplashErrorFunction
    ): void
    /** [wx.miniapp.offOpensdkLog(function fn)](wx.miniapp.offOpensdkLog.md)
*
* 该能力可以取消对 微信 Open SDK 过程的日志的监听
*
* **示例代码**
*
* ```js
const opensdkLog = (e) => {
  console.log('offOpensdkLog', e)
}

wx.miniapp.offOpensdkLog(opensdkLog)
``` */
    offOpensdkLog(
        /** 日志监听回调 */
        fn: OffOpensdkLogFunction
    ): void
    /** [wx.miniapp.onAdSplashError(function fn)](wx.miniapp.onAdSplashError.md)
*
* 开屏广告失败时触发
*
* **示例代码**
*
* ```js
const adSplashError = (e) => {
  console.log('adSplashError', e)
}

wx.miniapp.onAdSplashError(adSplashError)
``` */
    onAdSplashError(
        /** 开屏广告失败监听回调 */
        fn: OnAdSplashErrorFunction
    ): void
    /** [wx.miniapp.onOpensdkLog(function fn)](wx.miniapp.onOpensdkLog.md)
*
* 该能力可以输出使用微信 Open SDK 过程的日志
*
* **示例代码**
*
* ```js
const opensdkLog = (e) => {
  console.log('onOpensdkLog', e)
}

wx.miniapp.onOpensdkLog(opensdkLog)
``` */
    onOpensdkLog(
        /** 日志监听回调 */
        fn: OnOpensdkLogFunction
    ): void
    /** [wx.miniapp.openAppStoreRating(Object object)](wx.miniapp.openAppStoreRating.md)
*
* 快捷打开 App Store 评分弹窗
*
* **示例代码**
*
* ```js
wx.miniapp.openAppStoreRating({
 fail(e) {
   console.log('openAppStoreRating fail', e)
 }
})
``` */
    openAppStoreRating(option: OpenAppStoreRatingOption): void
    /** [wx.miniapp.openCustomerServiceChat(Object object)](wx.miniapp.openCustomerServiceChat.md)
*
* 支持调用该接口拉起微信客服功能
*
* **示例代码**
*
* ```js
wx.miniapp.openCustomerServiceChat({
  corpId: 'xxxx', // 企业id
  url: 'https://work.weixin.qq.com/kfid/kfcxxxxx',
  complete(res) {
    console.error('miniapp.openCustomerServiceChat', res)
  },
  success(res) {
    wx.showToast({
      title: '成功：分享图片',
    })
  },
  fail() {
    wx.showToast({
      title: '失败：分享图片',
    })
  }
})
``` */
    openCustomerServiceChat<
        T extends OpenCustomerServiceChatOption = OpenCustomerServiceChatOption
    >(
        option: T
    ): PromisifySuccessResult<T, OpenCustomerServiceChatOption>
    /** [wx.miniapp.openSaaAActionSheet(Object object)](wx.miniapp.openSaaAActionSheet.md)
*
* 打开 SDK 操作菜单栏
*
* **示例代码**
*
*  ```js
 wx.miniapp.openSaaAActionSheet({
  success(res) {

  },
  fail(res) {

  }
})
 ``` */
    openSaaAActionSheet(option: OpenSaaAActionSheetOption): void
    /** [wx.miniapp.openUrl(Object object)](wx.miniapp.openUrl.md)
*
* 跳转第三方App。
*
* **示例代码**
*
* ```js
wx.miniapp.openUrl({
  url: "weixin://dl/moments",
  success(res) {
      console.log('wx.miniapp.openUrl success', res)
  },
  fail(err) {
      console.log('wx.miniapp.openUrl fail', err)
  }
})
``` */
    openUrl(option: OpenUrlOption): void
    /** [wx.miniapp.registOpenURL(function callback)](wx.miniapp.registOpenURL.md)
*
* ios:1.0.17|android1.0.8 监听进入App的事件，并获取参数。开发者可以监听通过 Scheme，Universal Link，微信开放标签 wx-open-launch-app 的方式进入App的事件，并且携带参数。
*
* **示例代码**
*
*  ```js
 wx.miniapp.registOpenURL((param) => {
    console.log('regsitOpenUrl', param)
})
 ``` */
    registOpenURL(
        /** 回调函数 */
        callback: RegistOpenURLCallback
    ): void
    /** [wx.miniapp.requestPayment(Object object)](wx.miniapp.requestPayment.md)
*
* App 调起微信支付
*
* **示例代码**
*
* ```js
wx.miniapp.requestPayment({
  timeStamp: '1667792176',
  mchId: '1800009365',
  prepayId: 'wx07113616363804b19dde94884922030000',
  package: 'Sign=WXPay',
  nonceStr: '8ne443gjxxg',
  sign: '4FF5900870B5C5BCB089789BC004156426C46512CE566DB17C131747E09ADEBA',
  success: (res) => {
    console.warn('wx.miniapp.requestPayment success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.requestPayment res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.requestPayment res:', res)
  }
})
``` */
    requestPayment<T extends RequestPaymentOption = RequestPaymentOption>(
        option: T
    ): PromisifySuccessResult<T, RequestPaymentOption>
    /** [wx.miniapp.requestSubscribeMessage(Object object)](wx.miniapp.requestSubscribeMessage.md)
*
* App 跳转微信获取一次性订阅消息
*
* **示例代码**
*
* ```js
wx.miniapp.requestSubscribeMessage({
  templateId: 'aY74R-xxxxxx-IxxxxxxxxxxxxxxkTBPs',
  reserved: 'hello',
  scene: 0,
  success: (res) => {
    console.warn('wx.miniapp.requestSubscribeMessage success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.requestSubscribeMessage res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.requestSubscribeMessage res:', res)
  }
})
``` */
    requestSubscribeMessage<
        T extends RequestSubscribeMessageOption = RequestSubscribeMessageOption
    >(
        option: T
    ): PromisifySuccessResult<T, RequestSubscribeMessageOption>
    /** [wx.miniapp.revokePrivacySetting(Object object)](wx.miniapp.revokePrivacySetting.md)
*
* 撤销隐私授权
*
* **示例代码**
*
* ```js
wx.miniapp.revokePrivacySetting({
  success (res) {
    console.log('revokePrivacySetting success')
  }
})
``` */
    revokePrivacySetting(option?: RevokePrivacySettingOption): void
    /** [wx.miniapp.setEnableAdSplash(Object object)](wx.miniapp.setEnableAdSplash.md)
*
* App 设置开屏广告开启时，开发者可本地设置是否展示开屏广告。由于该标志位储存在 App 本地，App 卸载重装将导致该标志位失效。如果 App 本地没有该标志位信息，开屏广告是否展示由 project.miniapp.json 中的 SplashAd defaultEnable 开关控制，该开关默认开启。工具的配置具体可查看腾讯优量汇广告使用指南，这个接口能力依赖 GDT SDK，开发者需在 project.miniapp.json 中勾选对应的扩展 SDK
*
* **示例代码**
*
*  ```js
 wx.miniapp.setEnableAdSplash({
    enable: false
})
 ``` */
    setEnableAdSplash(option: SetEnableAdSplashOption): void
    /** [wx.miniapp.setSaaAUserId(object args)](wx.miniapp.setSaaAUserId.md)
*
* 通过 JSAPI 设置 userId
*
* **示例代码**
*
*  ```js
 wx.miniapp.setSaaAUserId({
  userId: '用户的userId',// 开发者可自定义
})
 ``` */
    setSaaAUserId(args: SetSaaAUserIdOption): void
    /** [wx.miniapp.shareFile(Object object)](wx.miniapp.shareFile.md)
*
* 调用系统接口分享文件。
*
* **示例代码**
*
* ```js
wx.miniapp.shareFile({
  filePath: 'wxfile://',
  success(res) {
    console.log(res.errMsg)
  }
})
``` */
    shareFile(option: ShareFileOption): void
    /** [wx.miniapp.shareImageMessage(Object object)](wx.miniapp.shareImageMessage.md)
*
* 分析图片到目标场景
*
* **示例代码**
*
* ```js
wx.miniapp.shareImageMessage({
  imagePath: 'xxxx',
  thumbPath: 'xxx',
  scene: 0,
  success(res) {},
  fail() {}
})
``` */
    shareImageMessage<
        T extends ShareImageMessageOption = ShareImageMessageOption
    >(
        option: T
    ): PromisifySuccessResult<T, ShareImageMessageOption>
    /** [wx.miniapp.shareMiniProgramMessage(Object object)](wx.miniapp.shareMiniProgramMessage.md)
*
* App 分享小程序卡片到微信
*
* **示例代码**
*
* ```js
wx.miniapp.shareMiniProgramMessage({
  userName: '小程序原始id',
  path: 'pages/index/index',
  imagePath: '/pages/thumb.png',
  webpageUrl: 'www.qq.com',
  withShareTicket: true,
  miniprogramType: 0,
  scene: 0,
  success: (res) => {
    console.warn('wx.miniapp.shareMiniProgramMessage success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.shareMiniProgramMessage res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.shareMiniProgramMessage res:', res)
  }
})
``` */
    shareMiniProgramMessage<
        T extends ShareMiniProgramMessageOption = ShareMiniProgramMessageOption
    >(
        option: T
    ): PromisifySuccessResult<T, ShareMiniProgramMessageOption>
    /** [wx.miniapp.shareTextMessage(Object object)](wx.miniapp.shareTextMessage.md)
*
* App 分享文本到微信
*
* **示例代码**
*
* ```js
wx.miniapp.shareTextMessage({
  text: '分享文本',
  scene: 0,
  success: (res) => {
    console.warn('wx.miniapp.shareTextMessage success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.shareTextMessage res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.shareTextMessage res:', res)
  }
})
``` */
    shareTextMessage<T extends ShareTextMessageOption = ShareTextMessageOption>(
        option: T
    ): PromisifySuccessResult<T, ShareTextMessageOption>
    /** [wx.miniapp.shareVideoMessage(Object object)](wx.miniapp.shareVideoMessage.md)
*
* App 分享视频到微信
*
* **示例代码**
*
* ```js
wx.miniapp.shareVideoMessage({
  title: 'title',
  description: 'description',
  videoUrl: 'https://xxxxx',
  videoLowBandUrl: 'https://xxxx',
  thumbPath: '/pages/thumb.png',
  scene: 0,
  success: (res) => {
    console.warn('wx.miniapp.shareVideoMessage success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.shareVideoMessage res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.shareVideoMessage res:', res)
  }
})
``` */
    shareVideoMessage<
        T extends ShareVideoMessageOption = ShareVideoMessageOption
    >(
        option: T
    ): PromisifySuccessResult<T, ShareVideoMessageOption>
    /** [wx.miniapp.shareWebPageMessage(Object object)](wx.miniapp.shareWebPageMessage.md)
*
* App 分享网页到微信
*
* **示例代码**
*
* ```js
wx.miniapp.shareWebPageMessage({
  text: '分享文本',
  scene: 0,
  success: (res) => {
    console.warn('wx.miniapp.shareWebPageMessage success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.shareWebPageMessage res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.shareWebPageMessage res:', res)
  }
})
``` */
    shareWebPageMessage<
        T extends ShareWebPageMessageOption = ShareWebPageMessageOption
    >(
        option: T
    ): PromisifySuccessResult<T, ShareWebPageMessageOption>
    /** [wx.miniapp.showStatusBar(Object object)](wx.miniapp.showStatusBar.md)
*
* 显示状态栏
*
* **示例代码**
*
* ```js
wx.miniapp.showStatusBar()
``` */
    showStatusBar(option?: ShowStatusBarOption): void
    /** [wx.miniapp.unRegistOpenURL(function callback)](wx.miniapp.unRegistOpenURL.md)
*
* 取消监听进入App的事件
*
* **示例代码**
*
*  ```js
 wx.miniapp.unRegistOpenURL((param) => {
    console.log('regsitOpenUrl', param)
})
 ``` */
    unRegistOpenURL(
        /** 回调函数 */
        callback: RegistOpenURLCallback
    ): void
    IAP: IAP
}

/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type AddPaymentByProductIdentifiersCompleteCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用失败的回调函数 */
type AddPaymentByProductIdentifiersFailCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用成功的回调函数 */
type AddPaymentByProductIdentifiersSuccessCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type AgreePrivacyAuthorizationCompleteCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用失败的回调函数 */
type AgreePrivacyAuthorizationFailCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用成功的回调函数 */
type AgreePrivacyAuthorizationSuccessCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type BindAppleCompleteCallback = (res: IdaasError) => void
/** 接口调用失败的回调函数 */
type BindAppleFailCallback = (res: IdaasError) => void
/** 接口调用成功的回调函数 */
type BindAppleSuccessCallback = (res: IdaasError) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type BindPhoneCompleteCallback = (res: IdaasError) => void
/** 接口调用失败的回调函数 */
type BindPhoneFailCallback = (res: IdaasError) => void
/** 接口调用成功的回调函数 */
type BindPhoneSuccessCallback = (res: IdaasError) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type BindWeixinCompleteCallback = (res: IdaasError) => void
/** 接口调用失败的回调函数 */
type BindWeixinFailCallback = (res: IdaasError) => void
/** 接口调用成功的回调函数 */
type BindWeixinSuccessCallback = (res: IdaasError) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type CanMakePaymentsCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type CanMakePaymentsFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type CanMakePaymentsSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type CheckBindInfoCompleteCallback = (res: IdaasError) => void
/** 接口调用失败的回调函数 */
type CheckBindInfoFailCallback = (res: IdaasError) => void
/** 接口调用成功的回调函数 */
type CheckBindInfoSuccessCallback = (
    result: CheckBindInfoSuccessCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type ChooseFileCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type ChooseFileFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type ChooseFileSuccessCallback = (
    result: ChooseFileSuccessCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type CloseAppCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type CloseAppFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type CloseAppModuleCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type CloseAppModuleFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type CloseAppModuleSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type CloseAppSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type CopyNativeFileToWxCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type CopyNativeFileToWxFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type CopyNativeFileToWxSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type CopyWxFileToNativeCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type CopyWxFileToNativeFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type CopyWxFileToNativeSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type FinishTransactionCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type FinishTransactionFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type FinishTransactionSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type GetAppStoreReceiptDataCompleteCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用失败的回调函数 */
type GetAppStoreReceiptDataFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type GetAppStoreReceiptDataSuccessCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type GetAppStoreReceiptURLCompleteCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用失败的回调函数 */
type GetAppStoreReceiptURLFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type GetAppStoreReceiptURLSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type GetMetaDataCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type GetMetaDataFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type GetMetaDataSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type GetPrivacySettingCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type GetPrivacySettingFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type GetPrivacySettingSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type GetSDKVersionCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type GetSDKVersionFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type GetSDKVersionSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type GetStorefrontCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type GetStorefrontFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type GetStorefrontSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type GetTransactionsCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type GetTransactionsFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type GetTransactionsSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type GoogleLoginCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type GoogleLoginFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type GoogleLoginSuccessCallback = (
    result: GoogleLoginSuccessCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type GoogleLogoutCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type GoogleLogoutFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type GoogleLogoutSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type GoogleRestoreLoginCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type GoogleRestoreLoginFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type GoogleRestoreLoginSuccessCallback = (
    result: GoogleLoginSuccessCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type HasWechatInstallCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type HasWechatInstallFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type HasWechatInstallSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type HideStatusBarCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type HideStatusBarFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type HideStatusBarSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type InstallAppCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type InstallAppFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type InstallAppSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type JumpToAppStoreCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type JumpToAppStoreFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type JumpToAppStoreSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type JumpToGooglePlayCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type JumpToGooglePlayFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type JumpToGooglePlaySuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type LaunchMiniProgramCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type LaunchMiniProgramFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type LaunchMiniProgramSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type LoadNativePluginCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type LoadNativePluginFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type LoadNativePluginSuccessCallback = (plugin: any) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type LoginCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type LoginFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type LoginSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type OffAdSplashErrorCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type OffAdSplashErrorFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type OffAdSplashErrorSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type OffOpensdkLogCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type OffOpensdkLogFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type OffOpensdkLogSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type OnAdSplashErrorCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type OnAdSplashErrorFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type OnAdSplashErrorSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type OnOpensdkLogCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type OnOpensdkLogFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type OnOpensdkLogSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type OpenAppStoreRatingCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type OpenAppStoreRatingFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type OpenAppStoreRatingSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type OpenCustomerServiceChatCompleteCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用失败的回调函数 */
type OpenCustomerServiceChatFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type OpenCustomerServiceChatSuccessCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type OpenSaaAActionSheetCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type OpenSaaAActionSheetFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type OpenSaaAActionSheetSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type OpenUrlCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type OpenUrlFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type OpenUrlSuccessCallback = (res: GeneralCallbackResult) => void
/** 回调函数 */
type RegistOpenURLCallback = (
    /** 唤起App的方式：'scheme','webpageURL','opensdkOnRep' */
    action: 'scheme' | 'webpageURL' | 'opensdkOnRep',
    /** 携带的详细信息 */
    data: any
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type RequestPaymentCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type RequestPaymentFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type RequestPaymentSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type RequestSKProductsCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type RequestSKProductsFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type RequestSKProductsSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type RequestSKReceiptRefreshRequestCompleteCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用失败的回调函数 */
type RequestSKReceiptRefreshRequestFailCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用成功的回调函数 */
type RequestSKReceiptRefreshRequestSuccessCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type RequestSubscribeMessageCompleteCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用失败的回调函数 */
type RequestSubscribeMessageFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type RequestSubscribeMessageSuccessCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type RestoreCompletedTransactionsCompleteCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用失败的回调函数 */
type RestoreCompletedTransactionsFailCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用成功的回调函数 */
type RestoreCompletedTransactionsSuccessCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type RevokePrivacySettingCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type RevokePrivacySettingFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type RevokePrivacySettingSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type ShareFileCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type ShareFileFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type ShareFileSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type ShareImageMessageCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type ShareImageMessageFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type ShareImageMessageSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type ShareMiniProgramMessageCompleteCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用失败的回调函数 */
type ShareMiniProgramMessageFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type ShareMiniProgramMessageSuccessCallback = (
    res: GeneralCallbackResult
) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type ShareTextMessageCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type ShareTextMessageFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type ShareTextMessageSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type ShareVideoMessageCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type ShareVideoMessageFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type ShareVideoMessageSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type ShareWebPageMessageCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type ShareWebPageMessageFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type ShareWebPageMessageSuccessCallback = (res: GeneralCallbackResult) => void
/** 接口调用结束的回调函数（调用成功、失败都会执行） */
type ShowStatusBarCompleteCallback = (res: GeneralCallbackResult) => void
/** 接口调用失败的回调函数 */
type ShowStatusBarFailCallback = (res: GeneralCallbackResult) => void
/** 接口调用成功的回调函数 */
type ShowStatusBarSuccessCallback = (res: GeneralCallbackResult) => void
interface IAP {
    /** [Object wx.miniapp.IAP.requestSKProducts(Object object)](wx.miniapp.IAP.requestSKProducts.md)
*
* 获取苹果内购 商品信息与取消获取商品信息
*
* **示例代码**
*
* ```js
wx.miniapp.requestSKProducts({
  productIdentifiers: [
    'testProductIdentifier',
    'testProductIdentifier',
  ],
  success: (res) => {
    console.warn('wx.miniapp.requestSKProducts success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.requestSKProducts res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.requestSKProducts res:', res)
  }
})
``` */
    requestSKProducts(option: RequestSKProductsOption): IAnyObject
    /** [boolean wx.miniapp.IAP.canMakePayments(Object object)](wx.miniapp.IAP.canMakePayments.md)
*
* 是否可以支付。使用[SKPaymentQueue canMakePayments];实现。
*
* **示例代码**
*
* ```js
const canMake = wx.miniapp.canMakePayments()
``` */
    canMakePayments(option?: CanMakePaymentsOption): boolean
    /** [wx.miniapp.IAP.addPaymentByProductIdentifiers(Object object)](wx.miniapp.IAP.addPaymentByProductIdentifiers.md)
*
* 发起商品购买
*
* **示例代码**
*
* ```js
wx.miniapp.addPaymentByProductIdentifiers({
  productIdentifier: 'testidentifier',
  applicationUsername: 'testidentifierUserName',
  quantity: 1,
  simulatesAskToBuyInSandbox: false,
  discount: {
    identifier: 'xxx',
    keyIdentifier: 'xxx',
    nonce: 'xxx',
    signature: 'xxx',
    timestamp: 'xxx',
  },
  success: (res) => {
    console.warn('wx.miniapp.addPaymentByProductIdentifiers success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.addPaymentByProductIdentifiers res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.addPaymentByProductIdentifiers res:', res)
  }
})
``` */
    addPaymentByProductIdentifiers(
        option: AddPaymentByProductIdentifiersOption
    ): void
    /** [wx.miniapp.IAP.addTransactionObserver(Object object)](wx.miniapp.IAP.addTransactionObserver.md)
*
* 监听交易队列的变化事件
*
* **示例代码**
*
* ```js
wx.miniapp.addTransactionObserver({
  updatedTransactions: (args) => {
    console.log(`updatedTransactions:`, args)
  },
  restoreCompletedTransactionsFailedWithError: (args) => {
    console.log(`restoreCompletedTransactionsFailedWithError:`, args)
  },
  paymentQueueRestoreCompletedTransactionsFinished: (args) => {
    console.log(`paymentQueueRestoreCompletedTransactionsFinished:`, args)
  },
  shouldAddStorePayment: (args) => {
    console.log(`shouldAddStorePayment:`, args)
  },
  paymentQueueDidChangeStorefront: (args) => {
    console.log(`paymentQueueDidChangeStorefront:`, args)
  },
  didRevokeEntitlementsForProductIdentifiers: (args) => {
    console.log(`didRevokeEntitlementsForProductIdentifiers:`, args)
  },
})
``` */
    addTransactionObserver(
        /** 监听函数对象 */
        option: AddTransactionObserverOption
    ): void
    /** [wx.miniapp.IAP.cancelRequestSKProducts(Object object)](wx.miniapp.IAP.cancelRequestSKProducts.md)
*
* 取消获取苹果内购 商品信息与取消获取商品信息
*
* **示例代码**
*
* ```js
wx.miniapp.cancelRequestSKProducts(requestObj)
``` */
    cancelRequestSKProducts(
        /** requestSKProducts返回的对象 */
        object: IAnyObject
    ): void
    /** [wx.miniapp.IAP.finishTransaction(Object object)](wx.miniapp.IAP.finishTransaction.md)
*
* 结束 苹果内购 交易
*
* **示例代码**
*
* ```js
wx.miniapp.finishTransaction({
  transactionIdentifier: 'xxxxxx',
  success: (res) => {
    console.warn('wx.miniapp.finishTransaction success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.finishTransaction res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.finishTransaction res:', res)
  }
})
``` */
    finishTransaction(option: FinishTransactionOption): void
    /** [wx.miniapp.IAP.getAppStoreReceiptData(Object object)](wx.miniapp.IAP.getAppStoreReceiptData.md)
*
* 苹果内购 获取收据本地Receipt的NSData，转base64Encode返回。
*
* **示例代码**
*
* ```js
wx.miniapp.getAppStoreReceiptData({
  success: (res) => {
    console.warn('wx.miniapp.getAppStoreReceiptData success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.getAppStoreReceiptData res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.getAppStoreReceiptData res:', res)
  }
})
``` */
    getAppStoreReceiptData(option: GetAppStoreReceiptDataOption): void
    /** [wx.miniapp.IAP.getAppStoreReceiptURL(Object object)](wx.miniapp.IAP.getAppStoreReceiptURL.md)
*
* 苹果内购 获取收据本地Receipt URL
*
* **示例代码**
*
* ```js
wx.miniapp.getAppStoreReceiptURL({
  success: (res) => {
    console.warn('wx.miniapp.getAppStoreReceiptURL success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.getAppStoreReceiptURL res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.getAppStoreReceiptURL res:', res)
  }
})
``` */
    getAppStoreReceiptURL(option: GetAppStoreReceiptURLOption): void
    /** [wx.miniapp.IAP.getStorefront(Object object)](wx.miniapp.IAP.getStorefront.md)
*
* 苹果内购 获取App Store的状态。使用[SKPaymentQueue defaultQueue].storefront实现。
*
* **示例代码**
*
* ```js
wx.miniapp.getStorefront({
  success: (res) => {
    console.warn('wx.miniapp.getStorefront success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.getStorefront res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.getStorefront res:', res)
  }
})
``` */
    getStorefront(option: GetStorefrontOption): void
    /** [wx.miniapp.IAP.getTransactions(Object object)](wx.miniapp.IAP.getTransactions.md)
*
* 苹果内购 获取当前的交易列表。通过[SKPaymentQueue defaultQueue].transactions实现。
*
* **示例代码**
*
* ```js
wx.miniapp.getTransactions({
  success: (res) => {
    console.warn('wx.miniapp.getTransactions success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.getTransactions res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.getTransactions res:', res)
  }
})
``` */
    getTransactions(option: GetTransactionsOption): void
    /** [wx.miniapp.IAP.removeTransactionObserver(Object object)](wx.miniapp.IAP.removeTransactionObserver.md)
*
* 取消监听交易队列的变化事件
*
* **示例代码**
*
* ```js
wx.miniapp.removeTransactionObserver(observeObj)
``` */
    removeTransactionObserver(
        /** 监听函数对象 与addTransactionObserver为同一个对象即可取消监听 */
        option: AddTransactionObserverOption
    ): void
    /** [wx.miniapp.IAP.requestSKReceiptRefreshRequest(Object object)](wx.miniapp.IAP.requestSKReceiptRefreshRequest.md)
*
* 苹果内购 本地可能没有收据，可以使用这个接口刷新。
*
* **示例代码**
*
* ```js
wx.miniapp.requestSKReceiptRefreshRequest({
  success: (res) => {
    console.warn('wx.miniapp.requestSKReceiptRefreshRequest success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.requestSKReceiptRefreshRequest res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.requestSKReceiptRefreshRequest res:', res)
  }
})
``` */
    requestSKReceiptRefreshRequest(
        option: RequestSKReceiptRefreshRequestOption
    ): void
    /** [wx.miniapp.IAP.restoreCompletedTransactions(Object object)](wx.miniapp.IAP.restoreCompletedTransactions.md)
*
* 让paymentQueue恢复之前结束的交易队列。
*
* **示例代码**
*
* ```js
wx.miniapp.restoreCompletedTransactions({
  success: (res) => {
    console.warn('wx.miniapp.restoreCompletedTransactions success:', res)
  },
  fail: (res) => {
    console.error('wx.miniapp.restoreCompletedTransactions res:', res)
  },
  complete: (res) => {
    console.error('wx.miniapp.restoreCompletedTransactions res:', res)
  }
})
``` */
    restoreCompletedTransactions(
        option: RestoreCompletedTransactionsOption
    ): void
}
interface GeneralCallbackResult {
    /** 错误信息 */
    errMsg: string
    errCode: number
}
interface AsyncMethodOptionLike {
    success?: (...args: any[]) => void
}
type PromisifySuccessResult<P, T extends AsyncMethodOptionLike> = P extends {
    success: any
}
    ? void
    : P extends { fail: any }
    ? void
    : P extends { complete: any }
    ? void
    : Promise<Parameters<Exclude<T['success'], undefined>>[0]>
