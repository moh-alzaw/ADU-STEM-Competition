import eel
import os
import shutil
import atexit

chromeDataDirectory = None

eel.init("web")

# Eel Core System
class CoreSystem:
    def exitCleanup():
        if (os.path.exists(chromeDataDirectory)):
            shutil.rmtree(chromeDataDirectory)
            os.makedirs(chromeDataDirectory)

    def startUp():
        userdataDirectory = os.path.join(os.getcwd(), 'chrome-instance-user-data')
        global chromeDataDirectory
        chromeDataDirectory = userdataDirectory
        if not (os.path.exists(userdataDirectory)):
            os.makedirs(userdataDirectory)
        eel.start("index.html", size=(800, 700), cmdline_args=["--disable-extensions", '--user-data-dir={}'.format(userdataDirectory)])
            

atexit.register(CoreSystem.exitCleanup)
CoreSystem.startUp()