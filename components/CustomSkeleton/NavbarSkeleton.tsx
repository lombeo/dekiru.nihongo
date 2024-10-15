import LineSkeleton from "./LineSkeleton"

const NavbarSkeleton = (props: any) => {
    const { heightArr } = props
    return (<>
        <LineSkeleton height={28} width="40%" radius="xl" />
        <div className="pt-5 mt-5 pl-3 border-t">
            {heightArr.map((cur, idx) => {
                return (
                    <div className="flex items-center gap-2 pb-3" key={idx}>
                        <LineSkeleton circle={true} height={20} />
                        <LineSkeleton height={20} width={heightArr[idx]} radius="xl" />
                    </div>)
            })}
        </div>
    </>)
}
export default NavbarSkeleton;