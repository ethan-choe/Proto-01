// [{ x: 0, y: 0, asset: '' }]


class PlatformSet {
    constructor(scene, lvlConfig, player) {
        this.scene = scene;
        this.group = this.scene.physics.add.staticGroup();
        this.isActive = false;

        const platforms = this.group.children.entries;

        this.group.create(400, 568, 'ground').setScale(2).refreshBody();
        for (let i = 0; i < lvlConfig.length; i++) {
            const element = lvlConfig[i];
            this.group.create(element.x, element.y, element.asset);
            
        }
        this.collider = this.scene.physics.add.collider(scene.player, this.group);
        this.collider.active = false;
    }

    activate() {
        this.isActive = true;
        this.collider.active = true;

        // this.visible.active = true;
        const platforms = this.group.children.entries;
        // platforms[1].visible = false;

        platforms.forEach(p => {
            p.visible = true;
        });

        console.log(this.group.children.entries.length);
        console.log(this.group.children);
    }

    deactivate() {
        this.isActive = false;
        this.collider.active = false;

        const platforms = this.group.children.entries;
        // platforms[1].visible = false;

        platforms.forEach(p => {
            p.visible = false;
        });
    }

    update(deltaTime) {
        // let size = this.children.entries.size;
        // for(let i = 1; i < size; i++)
        // {
        //     this.children.entries[i].visible = false;
        // }

        if(this.isActive)
        {
            this.collider.active = true;
        }
        else
        {
            this.collider.active = false;
        }
    }


}

/*
    Create a class for the platforms
    Loop through visible
        Set visiblibility to false
*/
module.exports = PlatformSet;
