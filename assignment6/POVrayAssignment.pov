#include "colors.inc" 
#include "particle.inc"
#include "Pawn.inc"
#include "King.inc"
#include "Queen.inc"
#include "Knight.inc"
#include "Rook.inc"
#include "Bishop.inc"
#include "Banana.inc"                         
#declare bananaPosZ = 8.0;
#declare bananaPosY = (0.5 * ((bananaPosZ) * (bananaPosZ)))-1;    
#declare bananaSize = 0.6;        
#declare bananaMoveZ = 0.5 * clock;
#declare whiteKingPos = -2.5;
#declare blackKingPos = 2.5;
#declare move = 0.5 * clock;
#if ( whiteKingPos + move <= 2.5 )
    #declare whiteKingPos = whiteKingPos + move;
#else
    #declare whiteKingPos = whiteKingPos;
#end
#if ( blackKingPos - move >= -2.5 )
    #declare blackKingPos = blackKingPos - move;
#else
    #declare blackKinPos = blackKingPos;
#end  
#if ( bananaPosZ >= -30.0 )                                                  
    #declare bananaPosZ = bananaPosZ - bananaMoveZ;
    #declare bananaPosY = (0.5 * ((bananaPosZ) * (bananaPosZ)))-1;   
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

#declare Mirror = texture { 
    pigment { color White } 
    finish { reflection 1 ambient 0.1 diffuse 0.0 }
}
#declare Shiny_Red = texture { 
    pigment { color Red } 
    finish { reflection 0.5 ambient 0.2 diffuse 0.8 specular 1 }
}
#declare Shiny_Cyan = texture { 
    pigment { color Cyan } 
    finish { reflection 0.5 ambient 0.2 diffuse 0.8 specular 1  }
}
#declare Shiny_Black = texture { 
    pigment { color Black } 
    finish { ambient 0 diffuse 0.8 specular 1  }
}
#declare Shiny_White = texture { 
    pigment { color White } 
    finish { ambient 0 diffuse 0.8 specular 1  }
}
#declare Floor = 
    plane { <0, 1, 0>, 0        
        texture { 
            checker texture { Shiny_Red }, texture { Shiny_Cyan } 
        }
    }       
object{Floor}

object { kingshape 
   texture { Shiny_White }
    scale <1, 1, 1>
    translate <whiteKingPos, 0, .5>
}

object { kingshape 
    texture { Shiny_Black }
    scale < 1, 1, 1>
    translate <blackKingPos, 0, 1.5>
}

object { pawnshape 
    texture {
        pigment { color Black }
    }
    translate <0, 0, 3>
} 

object { banana_0 
    texture {
        pigment { color Yellow }
    }                
    scale 10 
    rotate <0, 0, 45>
    translate <bananaPosZ, bananaPosY, 1>
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