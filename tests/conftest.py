import pytest
import requests


# 定义基础URL
@pytest.fixture(scope="session")
def base_url():
    return "http://127.0.0.1"

# 创建一个共享的 requests Session 对象
@pytest.fixture(scope="function")
def api_client():
    session = requests.Session()
    session.headers.update({
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIwMjk0MTQsInVpZCI6MSwicm9sZUlkIjowLCJpYXQiOjE3NDE0MjQ2MTR9.9-54YBPClTF4NXQfjA9SQhCKQqvR0FNiUakUGUGAmcw'
    })
    yield session
    session.close()  # 测试结束后自动关闭连接