import { useEffect, useState } from 'react';

export const useMousePosition = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const setFromEvent = (e) => {
          setPosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', setFromEvent);

      return () => {
        window.removeEventListener('mousemove', setFromEvent);
      };
    }, []);

    return position;
  };

export const useMouseHoverOverElement = (parentRef: React.RefObject<Element>) => {
    const [ isOverElement, setIsOverElement ] = useState(false);
    const mousePosition = useMousePosition();

    useEffect(() => {
        if (!!parentRef.current) {
            const rect = parentRef.current?.getBoundingClientRect();
            if (mousePosition.x < rect!.left || mousePosition.x >= rect!.right) {
                setIsOverElement(false);
                return;
            }

            if (mousePosition.y < rect!.top || mousePosition.y >= rect!.bottom) {
                setIsOverElement(false);
                return;
            }

            setIsOverElement(true);
        }
    }, [mousePosition, parentRef.current]);

    return isOverElement;
  };
