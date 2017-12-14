#include "colors.inc"  // Include color name macros
#include "particle.inc"

// $ povray +POVrayAssignment.pov

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

sphere {
    <0, 3, 3>, 2         // X, Y, Z and radius of the sphere
    texture {
        pigment { color Yellow }
    }
}

#declare Floor = 
    plane { <0, 1, 0>, -1
        pigment {
            checker color Red, color Blue
        }
    }       
object{Floor}
  
//box {
//    <-1, 0,   -1>,  // Near lower left corner
//   < 1, 0.5,  3>   // Far upper right corner
//	pigment{
//		color Green
//	}
//} 

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