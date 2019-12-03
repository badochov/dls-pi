from stack import get_time_running, get_latest, record_audio, set_running, get_press, clear_press
import threading
from time import sleep, time
import pygame, sys
from helper import round_id, comp_id
from picamera import PiCamera
from PIL import Image
import io
import zbarlight
import requests
def makeTime(time,penalty=0):
    time+=penalty
    minutes=time//6000
    if minutes:
        return str(minutes)+':'+makeTime(time%6000)
    return str("{:5.2f}".format((time%6000)/100))
def to_strrr(centiseconds):
    final = ""
    centiseconds = str(centiseconds)
    centiseconds = centiseconds[::-1]
    if len(centiseconds) == 1:
        centiseconds+="0"
    if len(centiseconds) == 2:
        centiseconds+="0"
    for x in enumerate(centiseconds):
        if x[0] == 2:
            final+="."
        if x[0] == 4:
            final+=":"
        final+=x[1]
    return final[::-1]
pygame.init()
wyswietlacz = pygame.display.Info()
size = (wyswietlacz.current_w, wyswietlacz.current_h)
print(size)
#screen = pygame.display.set_mode(size, pygame.FULLSCREEN)
screen = pygame.display.set_mode(size)
running = True
white = (255, 255, 255)
green = (0, 255, 0)
black = (0, 0, 0)
pygame.font.init()
myfont = pygame.font.SysFont('Sans', 70)
myfont50 = pygame.font.SysFont('Sans', 50)
myfontbig = pygame.font.SysFont('Sans', 150)
plusmuch = 0
thread = threading.Thread(target=record_audio)
thread.start()
mode = 4
plusmuch = 0
dnf = False
camera = PiCamera(framerate = 60, resolution = (1280, 720))
#camera.rotation = 180
dude_name = ""
staff_id = 0
staff_name = ""
latest_time = 0
preview = False
time_insp_start = 0
penalty = 0
isdnf = False
judge_id = 0
camera.start_preview(alpha=255, fullscreen = False, window = (150, 150, size[0]-100, size[1]-100))
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.unicode == 'q':
                camera.stop_preview()
                running = False
    if mode == 0:
        screen.fill(white)
        sedzia = myfont.render("Kliknij aby zczytać QR sędziego", False, black)
        xd = myfont.size("Kliknij aby zczytać QR sędziego")
        screen.blit(sedzia, (size[0]/2 - xd[0]/2, size[1]/2 - xd[1]/2))
        pygame.display.update()
        if get_press() != False:
            mode = 1
            clear_press()
    if mode == 1:
        screen.fill(white)
        sedzia = myfont.render("QR sędziego", False, black)
        xd = myfont.size("QR sędziego")
        screen.blit(sedzia, (size[0]/2-xd[0]/2, 0))
        pygame.display.update()
        codes = None
        tries = 1
        camera.start_preview(alpha=255, fullscreen = False, window = (150, 150, size[0]-100, size[1]-100))
        while codes== None:
            tries+=1
            stream = io.BytesIO()
            camera.capture(stream, format='jpeg')
            stream.seek(0)
            image = Image.open(stream)
            codes = zbarlight.scan_codes('qrcode', image)
        helper = codes[0].decode('utf-8').split(',')
        judge_id = helper[0]
        print(judge_id)
        camera.stop_preview()
        mode = 2
        clear_press()
    if mode == 2:
        screen.fill(white)
        sedzia = myfont.render("Preinspekcja", False, black)
        xd = myfont.size("Preinspekcja")
        screen.blit(sedzia, (size[0]/2 - xd[0]/2, size[1]/2 - xd[1]/2))
        pygame.display.update()
        if get_press() != False:
            mode = 3
            time_insp_start = time()
            clear_press()
            camera.start_preview(alpha=255, fullscreen = False, window = (150, 150, size[0]-100, size[1]-100))
    if mode == 3:
        time_int = 15-round(time()-time_insp_start)
        if time_int >0:
            time_remaining = str(time_int)
        elif time_int > -2:
            time_remaining = "+2"
        else:
            time_remaining = "DNF"
        screen.fill(white)
        text = myfont.render(time_remaining, False, black)
        texts = myfont.size(time_remaining)
        screen.blit(text, (size[0]/2-texts[0]/2, 0))
        pygame.display.update()
        if get_time_running():
            mode = 4
            clear_press()
    if mode == 4:
        tajm = makeTime(get_latest())
        text = myfont.render(tajm, False, black)
        texts = myfont.size(tajm)
        screen.fill(white)
        screen.blit(text, (size[0]/2-texts[0]/2, 0))
        pygame.display.update()
    if mode == 5:
        screen.fill(white)
        czas = makeTime(get_latest(),penalty)
        if penalty != 0:
            czas = czas + "+"
        if isdnf:
            czas = "DNF"
        text = myfontbig.render(czas, False, black)
        texts = myfontbig.size(czas)
        screen.blit(text, (size[0]/2-texts[0]/2, size[1]/2-texts[1]/2))
        pygame.display.update()
        if get_time_running():
            mode = 4
            camera.start_preview(alpha=255, fullscreen = False, window = (150, 150, size[0]-100, size[1]-100))
        buton = get_press()
        if buton == '4' and penalty != -1:
            penalty += 2
        if buton == '3' and penalty > 0:
            penalty -= 2
        if buton == '2':
            isdnf = not isdnf
        if buton == '1':
            mode = 6
    if mode == 6:
        screen.fill(white)
        sedzia = myfont.render("QR Zawodnika", False, black)
        xd = myfont.size("QR zawodnika")
        screen.blit(sedzia, (size[0]/2-xd[0]/2, 0))
        pygame.display.update()
        codes = None
        tries = 1
        camera.start_preview(alpha=255, fullscreen = False, window = (150, 150, size[0]-100, size[1]-100))
        while codes== None:
            tries+=1
            stream = io.BytesIO()
            camera.capture(stream, format='jpeg')
            stream.seek(0)
            image = Image.open(stream)
            codes = zbarlight.scan_codes('qrcode', image)
        camera.stop_preview()
        helper = codes[0].decode('utf-8').split(',')
        dude_id = helper[0]
        url = "https://ttwmobile.eu/insert_time.php"
        data = {}
        if not dnf:
            data = {'cuberid':int(dude_id), 'time':str(get_latest()+penalty*100), 'judgeid':int(judge_id)}
        if dnf:
            data = {'cuberid':int(dude_id), 'time':'4444444', 'judgeid':int(judge_id)}
        penalty = 0
        dnf = False
        r = requests.post(url, data=data)
        print(r.status_code, r.reason)
        mode = 0
set_running(False)
#camera.close()
pygame.quit()
sys.exit()
