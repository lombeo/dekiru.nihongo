import CourseItem, { CourseItemProps } from "../CouseItem";

const CourseList: React.FC<{ courses: CourseItemProps[], refetch: any }> = ({ courses, refetch }) => {
  
  return (
    <div className="grid w-full grid-cols-12 gap-4">
      {courses && courses.map((item, index) => (
        <CourseItem key={`course-${item?.id}`} data={item} refetch={refetch} />
      ))}
    </div>
  );
};

export default CourseList;
