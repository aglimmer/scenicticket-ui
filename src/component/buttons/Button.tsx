import React from 'react'
import classNames from 'classnames'
// import "./other.scss"
// import "../styles/index.scss"

// 枚举按钮大小
export enum ButtonSize {
    Large = 'lg',
    Small = 'sm'
}
// 枚举按钮类型
export enum ButtonType {
    Primary = 'primary',
    Default = 'default',
    Link = 'Link'
}
// 定义按钮属性的类型
interface BaseButtonProps {
    className?: string;
    btnType?: ButtonType;
    btnSize?: ButtonSize;
    disabled?: boolean;
    children: React.ReactNode;
    href?: string;

}
// 按钮属性的类型需要一致
// & 表示联合类型，添加Button基本属性类型
type NativeButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLElement>;
// 添加链接属性类型
type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLElement>;
// 取联合类型中可选的一种
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;
// 实现一个自定的按钮组件
const Button: React.FC<ButtonProps> = (props) => {
    // children属性，用于获取标签中的字符
    // ...restProps去除剩余的属性
    const {
        btnType,
        className,
        disabled,
        btnSize,
        children,
        href,
        ...restProps
    } = props;
    // classNames函数
    // btn、btn-lg、btn-primary
    const classes = classNames('btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${btnSize}`]: btnSize,
        'disabled': (btnType === ButtonType.Link) && disabled
    })
    console.log("children：",children)
    // 按钮类型为链接
    if (btnType === ButtonType.Link && href) {
        return (
            <a
                className={classes}
                href={href}
                {...restProps}
            >
                {children}
            </a>

        )
// 按钮类型为标签
    } else {
        return (
            <button className={classes}
                disabled={disabled}
                {...restProps}
            >{children}</button>
        )

    }

}

Button.defaultProps = {
    disabled: false,
    btnType: ButtonType.Default
}
export default Button
