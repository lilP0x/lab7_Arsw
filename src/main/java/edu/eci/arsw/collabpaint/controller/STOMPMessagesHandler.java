package edu.eci.arsw.collabpaint.controller;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;
import edu.eci.arsw.collabpaint.model.Polygon;

@Controller
public class STOMPMessagesHandler {
    @Autowired
    SimpMessagingTemplate msgt;
    
    private final Map<Integer, List<Point>> drawings = new ConcurrentHashMap<>();

    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:"+pt);

        // Añadir el punto al dibujo correspondiente
        drawings.computeIfAbsent(Integer.parseInt(numdibujo), k -> new ArrayList<>()).add(pt);
        msgt.convertAndSend("/topic/newpoint." + numdibujo, pt);
        
       
        if (drawings.get(Integer.parseInt(numdibujo)).size() >= 4) {
            Polygon polygon = new Polygon(drawings.get(Integer.parseInt(numdibujo))); 
            System.out.println("Nuevo Poligono en el servidor!:" + polygon.toString());
            msgt.convertAndSend("/topic/newpolygon." + numdibujo, polygon);
            drawings.remove(Integer.parseInt(numdibujo)); 
        }
    }
}

