import pygame
import serial.tools.list_ports
import sys
from time import time

from Classes.Time import Time
from Classes.Display import Display

running = True
porty = list(serial.tools.list_ports.comports())
stacks = []
for x in porty:
    print(x.description)
if x.description == "USB2.0-Serial" or x.description == "ttyACM0":
    stacks.append(serial.Serial(x.device, 19200))
print("wchodzi")
print("wykryto" + str(len(stacks)) + " stacki")

size = (1280, 720)
display = Display(size)

stage = 0


# 0 - rece na timery
# 1 - rece na timerach
# 2 - czas leci
# 3 - stop
# 4 - faul
debug = True
if debug:
    while True:
        try:
            buffer = ser.readline().decode().rstrip('\r\n')
            print(buffer)
        except UnicodeDecodeError as e:
            print(e)
        pass
        for ser in stacks:
            pass

has_relay_started = False
started_relay_time = time()

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
            if buffer[0] == '"':
                state.append(buffer)
            else:
                state.append('"' + buffer)
        except UnicodeDecodeError as e:
            print(e)
    count = 0
    print(state, stage)
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
        if stat[1] == " " and stage == 1:
            stage = 2
            time_start = Time(round(time()*100))
    if czy:
        if stage == 0:
            stage = 1
    # print(czy2)(czy2)
    if czy2 > len(stacks) - 2 and stage == 2:
        czy = True
        for x in range(len(state)):
            if state[x][2:7] != latest_state[x][2:7] or state[x][7] == "@":
                print(state[x])
                czy = False
        # print('siema')
        if czy:
            stage = 3
            act_time = time_start.difference_from_timestamp(time())
            print(act_time)
            end_state = state
            print(end_state)
    if czy3 and (stage == 3 or stage == 4):
        stage = 0
    else:
        for x in state:
            if x[1] == " ":
                count += 1
    if count > 1:
        if stage == 2:
            stage = 4
    display.clear()
    latest_state = state
    latest_state_time = time()
    if stage == 0:
        display.Text.print_string_as_main_text("Ręce na stopery")
        has_relay_started = False

    if stage == 1:
        display.Text.print_string_as_main_text("Start")

    if stage == 2:

        display.Text.print_string_as_main_text("Układanie")

        currTime = Time(round(time.time() - time_start * 100)).display_form()

        display.Text.print_string_as_secondary_text(currTime)

    if stage == 3:
        team_time = act_time
        display.Text.print_string_as_main_text(team_time)
        times = []
        for raw_time in end_state:
            times.append(Time(raw_time))
        final = ", ".join(times)

    if stage == 4:
        display.Text.print("DNF")
    pygame.display.update()

pygame.quit()
sys.exit()
