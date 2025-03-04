#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
@Project ：tests 
@File    ：test_put_user_info.py
@IDE     ：PyCharm 
@Author  ：Franctoryer
@Date    ：2025/3/3 22:40 
"""
import pytest


class TestPutUserInfo:
    def test_successful_put_user_info(self, api_client, base_url):
        url = f'{base_url}/user/info'
        body = {
            'gender': 1,
            'email': '643612824@qq.com',
            'phone': '13636452530',
            'signature': '手持两把锟斤拷，口中疾呼烫烫烫',
            'birthday': '2003-09-26'
        }
        res = api_client.put(url, json=body)
        json_data = res.json()
        # 检测状态码
        assert res.status_code == 200
        # 检测 code
        assert json_data['code'] == 1
        # 检测 msg
        assert json_data['msg'] == '修改成功'


    @pytest.mark.parametrize(
        'gender, email, phone, signature, birthday',
        [
            # gender 字段无效输入
            (None, '643612824@qq.com', '13636452530', '签名内容', '2003-09-26'),
            (-1, '643612824@qq.com', '13636452530', '签名内容', '2003-09-26'),
            (3, '643612824@qq.com', '13636452530', '签名内容', '2003-09-26'),

            # email 字段无效输入
            (1, 'invalid_email', '13636452530', '签名内容', '2003-09-26'),
            (1, '', '13636452530', '签名内容', '2003-09-26'),
            (1, '643612824qq.com', '13636452530', '签名内容', '2003-09-26'),

            # phone 字段无效输入
            (1, '643612824@qq.com', '123456789', '签名内容', '2003-09-26'),
            (1, '643612824@qq.com', '', '签名内容', '2003-09-26'),
            (1, '643612824@qq.com', '136364525301', '签名内容', '2003-09-26'),

            # signature 字段无效输入
            (1, '643612824@qq.com', '13636452530', None, '2003-09-26'),
            (1, '643612824@qq.com', '13636452530', 'a' * 101, '2003-09-26'),

            # birthday 字段无效输入
            (1, '643612824@qq.com', '13636452530', '签名内容', ''),
            (1, '643612824@qq.com', '13636452530', '签名内容', '2025-02-30'),
            (1, '643612824@qq.com', '13636452530', '签名内容', '2003/09/26'),

            # 组合无效输入
            (None, '', '', None, ''),
            (-1, 'invalid_email', '123456789', 'a' * 101, '2025-02-30'),
            (3, '643612824qq.com', '136364525301', None, '2003/09/26'),
            (None, '643612824@qq.com', '', '签名内容', ''),
            (-1, '', '13636452530', '', '2003-09-26'),
            (3, '643612824@qq.com', '', 'a' * 101, '2003-09-26'),
            (1, '', '13636452530', '', ''),
            (1, '643612824@qq.com', '', '签名内容', ''),
            (1, '', '13636452530', '', ''),
            (1, '', '', '', ''),
        ]
    )
    def test_invalid_input(self, api_client, base_url, gender, email, phone, signature, birthday):
        url = f'{base_url}/user/info'
        body = {
            'gender': gender,
            'email': email,
            'phone': phone,
            'signature': signature,
            'birthday': birthday
        }
        res = api_client.put(url, json=body)
        json_data = res.json()

        # 检测状态码
        assert res.status_code == 400
        # 检测 code
        assert json_data['code'] == 0