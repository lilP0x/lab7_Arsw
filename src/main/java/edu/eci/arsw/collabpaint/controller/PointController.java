package edu.eci.arsw.collabpaint.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;

@Controller
public class PointController {

    @MessageMapping("/newpoint")
    @SendTo("/topic/newpoint")
    public Point broadcastPoint(Point point) {
        return point;
    }
}
