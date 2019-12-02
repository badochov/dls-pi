import pygame
from Classes.Display.Text import Text


class Display:
    BLACK = (0, 0, 0)
    WHITE = (255, 255, 255)

    def __init__(self, size: (float, float), **kwargs):
        """
        Initializes Display instance in kwargs you can pass:
            - bg -> background color (in (R,G,B) format)(default is white)
            # - font_name -> font name (default is Sans)

        :param size:
        :param kwargs:
        """

        self.screen = pygame.display.set_mode(size, pygame.RESIZABLE)
        self.Text = Text(self)

        self.bg = kwargs.get("bg", Display.WHITE)
        # self.font_name = kwargs.get("font_name", Text.FONT_NAME)

    @property
    def size(self) -> (float, float):
        """
        Returns size of pygame window

        :return:
        """

        return self.screen.get_surface().get_size()

    def clear(self) -> None:
        """
        Clears window (paints it in bg color)

        :return:
        """

        self.screen.fill(self.bg)
