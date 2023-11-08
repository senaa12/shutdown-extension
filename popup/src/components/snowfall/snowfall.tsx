import React from 'react';
import Particles from 'react-tsparticles';

import './snowfall.scss';

export enum SnowfallDensity {
    Most = 1170,
    More = 1000,
    Normal = 820,
    Less = 650,
    Least = 460,
}

export enum SnowFallingSpeed {
    Fastest = 1.7,
    Normal = 1.5,
    Slow = 1.2,
}

export interface SnowfallProps {
    density?: SnowfallDensity;
    speed?: SnowFallingSpeed;
}

const snowfall = (props: SnowfallProps) => {
    const shouldShowSnowfall = React.useMemo(() => {
        const today = new Date();
        const startDateString = '9/11';
        const endDateString = '7/0';

        let startDate, endDate;
        if (today.getMonth() === 11) {
            startDate = new Date(
                today.getFullYear(),
                parseInt(startDateString.split('/')[1]),
                parseInt(startDateString.split('/')[0]));
            endDate = new Date(
                today.getFullYear() + 1,
                parseInt(endDateString.split('/')[1]),
                parseInt(endDateString.split('/')[0]));
        } else {
            startDate = new Date(
                today.getFullYear() - 1,
                parseInt(startDateString.split('/')[1]),
                parseInt(startDateString.split('/')[0]));
            endDate = new Date(
                today.getFullYear(),
                parseInt(endDateString.split('/')[1]),
                parseInt(endDateString.split('/')[0]));
        }

        return today.getTime() > startDate.getTime() && today.getTime() < endDate.getTime();
    }, []);

    if (!shouldShowSnowfall) {
        return null;
    }

    return (
            <Particles
                className='snowfall'
                canvasClassName='snowfall-canvas'
                params={{
                    particles: {
                        number: {
                            value: props.density ?? SnowfallDensity.Normal,
                            density: {
                                enable: true,
                                value_area: 800,
                            },
                        },
                        color: {
                            value: '#ffffff',
                        },
                        shape: {
                            type: 'circle',
                            stroke: {
                                width: 0.5,
                                color: '#ffffff',
                            },
                            polygon: {
                                nb_sides: 6,
                            },
                        },
                        opacity: {
                            value: 0.8,
                            random: false,
                            anim: {
                                enable: false,
                                speed: 1,
                                opacity_min: 0.1,
                                sync: false,
                            },
                        },
                        size: {
                            value: 3,
                            random: true,
                            anim: {
                                enable: false,
                                speed: 30,
                                size_min: 0.1,
                                sync: false,
                            },
                        },
                        line_linked: {
                            enable: false,
                            distance: 150,
                        },
                        move: {
                            enable: true,
                            speed: props.speed ?? SnowFallingSpeed.Normal,
                            direction: 'bottom',
                            straight: false,
                            random: false,
                            out_mode: 'out',
                            attract: {
                                enable: true,
                                rotateX: 300,
                                rotateY: 1200,
                            },
                        },
                    },
                }}
            />
    );
};

export default snowfall;
