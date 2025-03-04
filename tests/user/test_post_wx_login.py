#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
@Project ：tests 
@File    ：test_post_wx_login.py
@IDE     ：PyCharm 
@Author  ：Franctoryer
@Date    ：2025/3/3 14:37 
"""
class TestPostWxLogin:
    def test_wx_login_with_valid_code(self, api_client, base_url) -> None:
        url = f'{base_url}/wx-login'
