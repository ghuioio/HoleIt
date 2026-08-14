import { _decorator, Component, Quat, Vec3 } from 'cc';
import { LevelVec3Data } from './LevelDataTypes';

const { ccclass, property } = _decorator;

@ccclass('UnityTransformConverter')
export class UnityTransformConverter extends Component {
    @property({ tooltip: 'Global multiplier applied to Unity position data. Start at 0.1 and tune against the demo.' })
    public positionScale = 0.1;

    @property({ tooltip: 'Mirror the Unity X axis.' })
    public flipX = false;

    @property({ tooltip: 'Mirror the Unity Z axis. Toggle this first if the imported level looks mirrored.' })
    public flipZ = false;

    @property({ tooltip: 'Swap Unity X/Z before mirroring. Leave off unless the layout is rotated/transposed.' })
    public swapXZ = false;

    @property({ tooltip: 'Additional world X offset after conversion.' })
    public offsetX = 0;

    @property({ tooltip: 'Additional world Y offset after conversion.' })
    public offsetY = 0;

    @property({ tooltip: 'Additional world Z offset after conversion.' })
    public offsetZ = 0;

    @property({ tooltip: 'Additional Euler X rotation applied to every item.' })
    public rotationOffsetX = 0;

    @property({ tooltip: 'Additional Euler Y rotation applied to every item.' })
    public rotationOffsetY = 0;

    @property({ tooltip: 'Additional Euler Z rotation applied to every item.' })
    public rotationOffsetZ = 0;

    public convertPosition(source: LevelVec3Data, out: Vec3): Vec3 {
        let x = source.x;
        let z = source.z;

        if (this.swapXZ) {
            const temp = x;
            x = z;
            z = temp;
        }

        if (this.flipX) {
            x = -x;
        }
        if (this.flipZ) {
            z = -z;
        }

        out.set(
            x * this.positionScale + this.offsetX,
            source.y * this.positionScale + this.offsetY,
            z * this.positionScale + this.offsetZ,
        );
        return out;
    }

    public convertEuler(source: LevelVec3Data, out: Vec3): Vec3 {
        // Mirroring a coordinate axis also changes the handedness of rotations.
        // These rules are intentionally exposed through flip/swap settings so the
        // final orientation can be tuned visually against HM's Unity demo.
        let rx = source.x;
        let ry = source.y;
        let rz = source.z;

        if (this.swapXZ) {
            const temp = rx;
            rx = rz;
            rz = temp;
        }
        if (this.flipX) {
            ry = -ry;
            rz = -rz;
        }
        if (this.flipZ) {
            rx = -rx;
            ry = -ry;
        }

        out.set(
            rx + this.rotationOffsetX,
            ry + this.rotationOffsetY,
            rz + this.rotationOffsetZ,
        );
        return out;
    }

    public convertRotation(source: LevelVec3Data, out: Quat): Quat {
        const euler = new Vec3();
        this.convertEuler(source, euler);
        Quat.fromEuler(out, euler.x, euler.y, euler.z);
        return out;
    }
}
