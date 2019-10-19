import serial
import pygame
import serial.tools.list_ports
import sys
from time import time
is_running = False
value = "00000"
running = True
info="I"
lastByte="@"
porty = list(serial.tools.list_ports.comports())
stacks = []
for x in porty:
    print(x.description)
    if x.description == "USB2.0-Serial" or x.description == "ttyACM0":
        stacks.append(serial.Serial(x.device, 19200))
        print("wchodzi")
print("wykryto" + str(len(stacks)) + " stacki")
size = (1280, 720)
screen = pygame.display.set_mode(size)
white = (255, 255, 255)
black = (0, 0, 0)
moment = 0
pygame.font.init()
myfont = pygame.font.SysFont('Sans', 100)
# 0 - rece na timery
# 1 - rece na timerach
# 2 - czas leci
# 3 - stop
# 4 - faul
debug = True
if debug:
    while True:
        for ser in stacks:
            try:    
                buffer = ser.readline().decode().rstrip('\r\n')
                print(buffer)
            except UnicodeDecodeError:
                print("kuwa")
time_start = 0
act_time = 0
end_state = []
latest_state = []
latest_state_time = 0
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.unicode == 'q':
                running = False
    
    state = []
    for ser in stacks:
        try:
            buffer = ser.readline().decode().rstrip('\r\n')
            if buffer[0]=='"':
                state.append(buffer)
            else:
                state.append('"'+buffer)
        except UnicodeDecodeError:
            print("kuwa")
    count = 0
    print(state, moment)
    czy = True
    czy2 = 0
    czy3 = True
    for stat in state:
        if stat[1] != "A":
            czy = False
        if stat[1] == "S":
            czy2 += 1
        if stat[7] != "@":
            czy3 = False
        if stat[1] == " " and moment == 1:
            moment = 2
            time_start = time()
    if czy:
        if moment == 0:
            moment = 1
    #print(czy2)
    if czy2 > len(stacks)-2 and moment == 2:
        czy = True
        for x in range(len(state)):
            if state[x][2:7] != latest_state[x][2:7] or state[x][7] == "@":
                print(state[x])
                czy = False
        #print('siema')
        if czy:
            moment = 3
            act_time = round(latest_state_time - time_start, 2)
            print(act_time)
            end_state = state
            print(end_state)
    if czy3 and (moment == 3 or moment == 4):
        moment = 0
    else:
        for x in state:
            if x[1] == " ":
                count += 1
    if count > 1:
        if moment == 2:
            moment = 4
    screen.fill(white)
    latest_state = state
    latest_state_time = time()
    if moment == 0:
        tekst = myfont.render("Ręce na stopery", False, black)
        tekst_size = myfont.size("Ręce na stopery")
        screen.blit(tekst, (size[0]/2-tekst_size[0]/2, size[1]/2-tekst_size[1]/2))
    if moment == 1:
        tekst = myfont.render("Start", False, black)
        tekst_size = myfont.size("Start")
        screen.blit(tekst, (size[0]/2-tekst_size[0]/2, size[1]/2-tekst_size[1]/2))
    if moment == 2:
        tekst = myfont.render("Układanie", False, black)
        tekst_size = myfont.size("Układanie")
        screen.blit(tekst, (size[0]/2-tekst_size[0]/2, size[1]/2-tekst_size[1]/2))
    if moment == 3:
        yyy = str(act_time)
        tekst = myfont.render(yyy, False, black)
        tekst_size = myfont.size(yyy)
        screen.blit(tekst, (size[0]/2-tekst_size[0]/2, size[1]/2-tekst_size[1]/2))
        final = ""
        for timee in end_state:
            final+= str(int(timee[2:7])/100) + ', '
        final=final[:-2]
        tekst2 = myfont.render(final, False, black)
        tekst2_size = myfont.size(final)
        screen.blit(tekst2, (size[0]/2-tekst2_size[0]/2, size[1]/2-tekst2_size[1]/2+tekst_size[1]*2))
            
    if moment == 4:
        tekst = myfont.render("DNF", False, black)
        tekst_size = myfont.size("DNF")
        screen.blit(tekst, (size[0]/2-tekst_size[0]/2, size[1]/2-tekst_size[1]/2))
    pygame.display.update()
pygame.quit()
sys.exit()
