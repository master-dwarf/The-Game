#include "colors.inc" 
#include "particle.inc"
#include "Pawn.inc"
#include "King.inc"
#include "Queen.inc"
#include "Knight.inc"
#include "Rook.inc"
#include "Bishop.inc"
#declare kingPos = -1.6;
#declare move = 0.5;
#if (clock < 1) 
    #declare kingPos = -1.6;
#else
    #declare kingPos = kingPos + move;
#end

background { color Cyan }  

global_settings {max_trace_level 50}
global_settings {assumed_gamma 1.0}

// Lights!

light_source {
    <2, 4, -3>           // X, Y, and Z coordinates of the light source
    color White
}

// Camera!

camera {
    location <0, 2, -3>  // X, Y and Z coordinates of the camera
    look_at  <0, 1,  2>  // X, Y and Z coordinates of where the camera is aimed
}

// Object!

#declare MirrorRed = texture { 
    pigment { color Red } 
    finish { ambient 1 diffuse 0.8 specular 0.9 reflection 0.7 }
}
#declare MirrorBlue = texture { 
    pigment { color Blue } 
    finish { reflection 1 ambient 0.1 diffuse 0 }
}
#declare Floor = 
    plane { <0, 1, 0>, -1        
        texture { 
            checker texture { MirrorRed }, texture { MirrorBlue } 
        }
    }       
object{Floor}

object { kingshape 
    texture {
        pigment { color White }
    }
    scale <0.5, 0.5, 0.5>
    translate <kingPos, 0, 0>
}
  
// Clock settings
// **************

#declare particle_start  = 0.0;
#declare particle_end    = 1.0;
#declare particle_steps  = 20;

// General particle settings
// *************************

#declare particle_frequency = 100;
#declare particle_life      = 1.5;
#declare particle_lifeturb  = 0.0;
#declare particle_seed      = 123;

// Environment settings
// ********************

#macro particle_gravity  (Clock,Point) <0,-1,0> #end
#macro particle_wind     (Clock,Point) <0,0,0> #end

// Emitter settings
// ****************

#macro particle_emitter  (Clock) <Clock, Clock, Clock> #end
#macro particle_emitting (Clock) on      #end

// Collision settings
// ******************

#declare particle_blockobj     = object {Floor}
#declare particle_bounce       = 1.0;		    // As high on the way up as the way down
#declare particle_bounceoffset = 0.1;		    // To keep it from receding into the floor

// Particle element macro
// *********************************


#macro particle_element ()
//    Do things with the particle data here. Available data:
//    p_id,        p_random,    p_location,  p_direction, p_life,
//    p_age,       p_birth,     p_state,     p_rotate

sphere { < 0, 0, 0 >  0.04
  pigment { Red }
  finish {diffuse 1 specular 0.5}
  translate p_location
}
#end

// Call particle system
// ********************

particle_system ("POVrayAssignment")