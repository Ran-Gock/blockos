function showNotification(message) {
    const notificationContainer = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 500);
    }, 3000);
}

let player = document.querySelector('.player');
let menuBlocks = document.querySelectorAll('.menu-blocks');
let blocksContainer = document.querySelector('.blocks');
let blocks = [];
let joints = [];
let currentX = 0;
let currentY = 0;
var audio = new Audio('videoplayback.m4a');

function startDrag(event) {
    let currentBlock = event.target;
    let initialX = event.clientX;
    let initialY = event.clientY;
    let startX = parseInt(currentBlock.style.left);
    let startY = parseInt(currentBlock.style.top);

    function onMouseMove(event) {
        currentBlock.style.left = `${Math.max(5, Math.min(window.innerWidth - 220, startX + event.clientX - initialX))}px`;
        currentBlock.style.top = `${Math.max(document.querySelector('header').getBoundingClientRect().height + 120, Math.min(startY + event.clientY - initialY, window.innerHeight - 70))}px`;
        currentX = event.clientX;
        currentY = event.clientY;

        if ((currentX > document.querySelector('.menu').getBoundingClientRect().x - 150) || 
            (currentX < (document.querySelector('.action').getBoundingClientRect().width) + 50)) {
            currentBlock.style.opacity = '0.5';
        } else {
            currentBlock.style.opacity = '1';
        }

        blocks.forEach((el) => {
            if (el !== currentBlock) {
                if ((currentX < (el.getBoundingClientRect().x + el.getBoundingClientRect().width + 50)) && 
                    (currentX > (el.getBoundingClientRect().x - 50)) &&
                    (currentY < (el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2)) && 
                    (currentY > (el.getBoundingClientRect().y - 50)) && 
                    (el.width !== 160)) {
                    
                    let newPos = { left: el.style.left, top: (parseInt(el.style.top) - currentBlock.getBoundingClientRect().height + (54 / 3)) + 'px' };
                    if (!isPositionOccupied(newPos)) {
                        currentBlock.style.left = el.style.left;
                        currentBlock.style.top = (parseInt(el.style.top) - currentBlock.getBoundingClientRect().height + (54 / 3)) + 'px';
                        currentBlock.style.opacity = '0.7';
                    }
                } else if ((currentX < (el.getBoundingClientRect().x + el.getBoundingClientRect().width + 50)) && 
                           (currentX > (el.getBoundingClientRect().x - 50)) &&
                           (currentY < (el.getBoundingClientRect().y + el.getBoundingClientRect().height + 50)) && 
                           (currentY > (el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2)) &&
                           (currentBlock.width !== 160)) {
                    
                    let newPos = { left: el.style.left, top: (parseInt(el.style.top) + el.getBoundingClientRect().height - (54 / 3)) + 'px' };
                    if (!isPositionOccupied(newPos)) {
                        currentBlock.style.left = el.style.left;
                        currentBlock.style.top = (parseInt(el.style.top) + el.getBoundingClientRect().height - (54 / 3)) + 'px';
                        currentBlock.style.opacity = '0.7';
                    }
                }
            }
        });
    }

    function onMouseUp(event) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if ((currentX > document.querySelector('.menu').getBoundingClientRect().x - 150) || 
            (currentX < (document.querySelector('.action').getBoundingClientRect().width) + 50)) {
            if(currentBlock.style.opacity!='1') {
                currentBlock.remove();
            }

            blocks = blocks.filter(block => block !== currentBlock);
            joints = joints.filter(joint => joint.block !== currentBlock);
        } else {
            currentBlock.style.opacity = '1';
            joints.push({ block: currentBlock, left: currentBlock.style.left, top: currentBlock.style.top });
        }
        currentX = 0;
        currentY = 0;
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function isPositionOccupied(newPos) {
    return joints.some(joint => joint.left === newPos.left && joint.top === newPos.top);
}

blocks.forEach(block => {
    block.addEventListener('mousedown', startDrag);
});

menuBlocks.forEach((block) => {
    block.addEventListener("mousedown", (event) => {
        let newBlock = document.createElement('img');
        newBlock.src = block.src;
        newBlock.classList = block.classList;
        newBlock.draggable = false;
        newBlock.style.position = 'absolute';
        newBlock.style.left = `${event.clientX}px`;
        newBlock.style.top = `${event.clientY}px`;
        currentBlock = blocksContainer.appendChild(newBlock);
    
        function onMouseMove(event) {
            currentBlock.style.left = `${Math.max(5, Math.min(window.innerWidth - 220, event.clientX - 50))}px`;
            currentBlock.style.top = `${Math.max(document.querySelector('header').getBoundingClientRect().height + 120, Math.min(event.clientY - 10, window.innerHeight - 70))}px`;
            currentX = event.clientX;
            currentY = event.clientY;

            if ((currentX > document.querySelector('.menu').getBoundingClientRect().x - 150) || 
                (currentX < (document.querySelector('.action').getBoundingClientRect().width) + 50)) {
                currentBlock.style.opacity = '0.5';
            } else {
                currentBlock.style.opacity = '1';
            }

            blocks.forEach((el) => {
                if (el !== currentBlock) {
                    if ((currentX < (el.getBoundingClientRect().x + el.getBoundingClientRect().width + 50)) && 
                        (currentX > (el.getBoundingClientRect().x - 50)) &&
                        (currentY < (el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2)) && 
                        (currentY > (el.getBoundingClientRect().y - 50)) && 
                        (el.width !== 160)) {
                        
                        let newPos = { left: el.style.left, top: (parseInt(el.style.top) - currentBlock.getBoundingClientRect().height + (54 / 3)) + 'px' };
                        if (!isPositionOccupied(newPos)) {
                            currentBlock.style.left = el.style.left;
                            currentBlock.style.top = (parseInt(el.style.top) - currentBlock.getBoundingClientRect().height + (54 / 3)) + 'px';
                            currentBlock.style.opacity = '0.7';
                        }
                    } else if ((currentX < (el.getBoundingClientRect().x + el.getBoundingClientRect().width + 50)) && 
                               (currentX > (el.getBoundingClientRect().x - 50)) &&
                               (currentY < (el.getBoundingClientRect().y + el.getBoundingClientRect().height + 50)) && 
                               (currentY > (el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2)) &&
                               (currentBlock.width !== 160)) {
                        
                        let newPos = { left: el.style.left, top: (parseInt(el.style.top) + el.getBoundingClientRect().height - (54 / 3)) + 'px' };
                        if (!isPositionOccupied(newPos)) {
                            currentBlock.style.left = el.style.left;
                            currentBlock.style.top = (parseInt(el.style.top) + el.getBoundingClientRect().height - (54 / 3)) + 'px';
                            currentBlock.style.opacity = '0.7';
                        }
                    }
                }
            });
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            let stop = false;

            if ((currentX > document.querySelector('.menu').getBoundingClientRect().x - 150) || 
                (currentX < (document.querySelector('.action').getBoundingClientRect().width) + 50)) {
                currentBlock.remove();
                stop = true;
            } else {
                currentBlock.style.opacity = '1';
                joints.push({ block: currentBlock, left: currentBlock.style.left, top: currentBlock.style.top });
            }
            currentX = 0;
            currentY = 0;

            if(currentBlock.classList.contains('menu-st')) {
                blocks.forEach(elem => {
                    if(elem.classList.contains('menu-st')){
                        currentBlock.remove();
                        stop = true;
                        showNotification('Нельзя добавить 2 блока \"Начать\" в одно и то же время!')
                    }
                });
            }

            if(currentBlock.classList.contains('menu-en')) {
                blocks.forEach(elem => {
                    if(elem.classList.contains('menu-en')){
                        currentBlock.remove();
                        stop = true;
                        showNotification('Нельзя добавить 2 блока \"Закончить\" в одно и то же время!')
                    }
                });
            }

            if(currentBlock.classList.contains('menu-re')) {
                currentBlock.remove();
                stop = true;
                showNotification('Блок \"Повторить\" временно недоступен!')
            }

            if(!stop) {
                if(currentBlock.classList.contains('menu-mo')) {
                    currentBlock.addEventListener('dblclick', (event) => {
                        let input = document.createElement('input');
                        input.draggable = false;
                        input.style.position = 'absolute';
                        input.style.left = `${currentBlock.getBoundingClientRect().x+(376/3)}px`;
                        input.style.top = `${currentBlock.getBoundingClientRect().y+10}px`;
                        input.style.width = `${100/3}px`;
                        input.style.height = `${68/3}px`;
                        blocksContainer.appendChild(input);
                        let parent = currentBlock;
                        blocks.push(currentBlock);
                        setInterval(() => {
                            console.log(!blocks.includes(parent))
                            if(!blocks.includes(parent)) {
                                input.remove();
                            }
                            else {
                                input.style.left = `${parent.getBoundingClientRect().x+(376/3)}px`;
                                input.style.top = `${parent.getBoundingClientRect().y+10}px`;
                            }
                        }, 1);
                    });
                }   
                blocks.push(currentBlock);
                currentBlock.addEventListener('mousedown', startDrag);
            }
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
});

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function getPositionAtCenter(element) {
    const {top, left, width, height} = element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2
    };
  }
 
 function getDistanceBetweenElements(a, b) {
   const aPosition = getPositionAtCenter(a);
   const bPosition = getPositionAtCenter(b);
 
   return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);  
 }

player.style.top = document.querySelector('.action').getBoundingClientRect().height*0.8 + 'px';
player.style.left = document.querySelector('.action').getBoundingClientRect().width*0.5 - 50 + 'px';
document.querySelector('.head img').addEventListener('click', (evt) => {
    commands = [];
    
    let blocksWithPositions = blocks.map(block => {
        return {
            block: block,
            yPos: parseInt(block.style.top)
        };
    });

    blocksWithPositions.sort((a, b) => a.yPos - b.yPos);

    blocksWithPositions.forEach(blockWithPos => {
        commands.push(blockWithPos.block);
    });

    isStart = false
    isStop = false
    commands.forEach((com) => {
        if(isStart && !isStop) {
            sleep(400);
            if(com.classList.contains('menu-rot-right')) {
                if(player.classList.contains('player-up'))
                    player.classList.toggle('player-up');
                if(player.classList.contains('player-left'))
                    player.classList.toggle('player-left');
                if(player.classList.contains('player-down'))
                    player.classList.toggle('player-down');

                if(!player.classList.contains('player-right'))
                    player.classList.toggle('player-right');
                console.log('right');
            }
            else if(com.classList.contains('menu-rot-left')) {
                if(player.classList.contains('player-up'))
                    player.classList.toggle('player-up');
                if(player.classList.contains('player-right'))
                    player.classList.toggle('player-right');
                if(player.classList.contains('player-down'))
                    player.classList.toggle('player-down');

                if(!player.classList.contains('player-left'))
                    player.classList.toggle('player-left');
                console.log('left');
            }
            else if(com.classList.contains('menu-rot-up')) {
                if(player.classList.contains('player-right'))
                    player.classList.toggle('player-right');
                if(player.classList.contains('player-left'))
                    player.classList.toggle('player-left');
                if(player.classList.contains('player-down'))
                    player.classList.toggle('player-down');

                if(!player.classList.contains('player-up'))
                    player.classList.toggle('player-up');
                console.log('up');
            }
            else if(com.classList.contains('menu-rot-down')) {
                if(player.classList.contains('player-up'))
                    player.classList.toggle('player-up');
                if(player.classList.contains('player-left'))
                    player.classList.toggle('player-left');
                if(player.classList.contains('player-right'))
                    player.classList.toggle('player-right');

                if(!player.classList.contains('player-down'))
                    player.classList.toggle('player-down');
                console.log('down');
            }
            else if(com.classList.contains('menu-en')) {
                isStop=true;
                console.log('end');
                audio.pause();
                audio,currentTime = 0;
            }
            else if(com.classList.contains('menu-mu')) {
                audio.play();
                console.log('audio');
            }
            else if(com.classList.contains('menu-mo')) {
                let its = null;
                document.querySelectorAll('input').forEach((inp, ind) => {
                    if(ind!=0){
                        if(getDistanceBetweenElements(com, inp) < getDistanceBetweenElements(com, its)) {
                            its = inp;
                        }
                    }
                    else {
                        its = inp;
                    }
                });
                if(its.value!=null) { 
                    if(player.classList.contains('player-down'))
                        player.style.transform = player.style.transform +' translateY('+Math.min(165, Math.max(parseInt(its.value), -350))+'px)';
                    if(player.classList.contains('player-up'))
                        player.style.transform = player.style.transform +' translateY('+Math.max(Math.min(-parseInt(its.value), 165), -350)+'px)';
                    console.log(-parseInt(its.value))
                    if(player.classList.contains('player-left'))
                        player.style.transform = player.style.transform +' translateX('+Math.max(0-(document.querySelector('.action').getBoundingClientRect().width*0.5-50), Math.min(document.querySelector('.action').getBoundingClientRect().width*0.5-30, -parseInt(its.value)))+'px)';
                    if(player.classList.contains('player-right'))
                        player.style.transform = player.style.transform +' translateX('+Math.min(document.querySelector('.action').getBoundingClientRect().width*0.5-30, Math.max(0-(document.querySelector('.action').getBoundingClientRect().width*0.5-50), parseInt(its.value)))+'px)';
                }
                console.log('move');
            }
        }
        else if(com.classList.contains('menu-st')) {
            isStart = true;
            player.style.top = document.querySelector('.action').getBoundingClientRect().height*0.8 + 'px';
            player.style.left = document.querySelector('.action').getBoundingClientRect().width*0.5 - 50 + 'px';
            player.style.transform = ''
            console.log('start');
        }
        
    });
});
