#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
@Project ：tests 
@File    ：test_get_exchange_rate.py
@IDE     ：PyCharm 
@Author  ：Franctoryer
@Date    ：2025/3/3 18:29 
"""
import pytest


class TestExchangeRate:
    def test_successful_exchange_rate(self, api_client, base_url) -> None:
        """
        正常响应的情况
        :param api_client:
        :param base_url:
        :return:
        """
        url = f'{base_url}/currency/exchange-rate'
        params = {
            'fromCurrencyISO': 'USD',
            'toCurrencyISO': 'CNY'
        }
        res = api_client.get(url, params=params)
        json_data = res.json()
        # 测试状态码
        assert res.status_code == 200
        # 测试 code
        assert json_data['code'] == 1
        # 测试包含字段
        necessary_fields = ['fromCurrencyISO', 'toCurrencyISO', 'timeLastUpdated', 'exchangeRate', 'provider']
        for field in necessary_fields:
            assert field in json_data['data']


    @pytest.mark.parametrize(
        "from_, to, msg, status",
        [
            ('cny', 'USD', '传参异常：ISO 代码必须由 3 个大写字母组成', 400),
            ('AA', 'USD', '传参异常：ISO 代码必须由 3 个大写字母组成', 400),
            ('AAA', 'USD', '原始货币类型不存在', 404),
            ('CNY', 'AAA', '目标货币类型不存在', 404)
        ]
    )
    def test_invalid_currency_type(self, api_client, base_url, from_, to, msg, status) -> None:
        """
        测试货币类型无效的情况
        :param api_client:
        :param base_url:
        :param from_: 原始货币类型输入
        :param to: 目标货币类型输入
        :param msg: 提示消息
        :param status: 状态码
        :return:
        """
        url = f'{base_url}/currency/exchange-rate'
        params = {
            'fromCurrencyISO': from_,
            'toCurrencyISO': to
        }
        res = api_client.get(url, params=params)
        json_data = res.json()
        # 测试状态码
        assert res.status_code == status
        # 测试 code
        assert json_data['code'] == 0
        # 测试错误消息
        assert json_data['msg'] == msg


