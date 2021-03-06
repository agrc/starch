import unittest
from selenium import webdriver
from time import sleep
from selenium.webdriver.support.ui import WebDriverWait


class BaseTest(unittest.TestCase):
    # url = r'http://broadband.utah.gov/map/'
    url = r'http://localhost/projects/Broadband/src'
    # url = raw_input('URL: ')
    autoShutdown = True
    shutdownDelay = 2

    def setUp(self):
        self.browser = webdriver.Chrome()
        self.browser.implicitly_wait(10)
        self.browser.get(self.url)
        self.browser.execute_script("""
            if (!window.SELENIUM) {
                window.SELENIUM = {};
            }
            require(['dojo/request/notify'], function (notify) {
                notify('stop', function () {
                    window.SELENIUM.ajaxComplete = true;
                });
                notify('start', function () {
                    window.SELENIUM.ajaxComplete = false;
                });
            });
            """)
        # trying to make sure that the map is loaded
        self.waitForAjax()
        disclaimerOK = self.browser.find_element_by_css_selector(".disclaimer-btn")
        sleep(1)
        if disclaimerOK.is_displayed():
            disclaimerOK.click()
            sleep(0.2)

    def tearDown(self):
        if self.autoShutdown:
            sleep(self.shutdownDelay)
            self.browser.quit()

    def waitForAjax(self, timeout=20):
        WebDriverWait(self.browser, timeout).until(lambda x: x.execute_script("""
            if (window.SELENIUM.ajaxComplete) {
                return window.SELENIUM.ajaxComplete;
            } else {
                return true;
            }
            """), 'Waiting for ajax request to complete')