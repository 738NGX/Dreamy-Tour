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
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDE2MDUxOTUsInVpZCI6MTIsImlhdCI6MTc0MTAwMDM5NX0.nI3F9T0X6MA7XcWUZ5Ia8fXXvGfKTlSuScTHf1Nwu9A'
    })
    yield session
    session.close()  # 测试结束后自动关闭连接