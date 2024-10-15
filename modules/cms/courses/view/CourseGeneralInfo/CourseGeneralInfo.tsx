import React from 'react';

interface CourseGeneralInfoProps {

}
export const CourseGeneralInfo = () => {
    return (
        <>
            <div className="grid grid-cols-3 gap-5 mt-0">
                <div className="col-span-2">
                    <div className="div">
                        <div>
                            Course Name
                        </div>

                        <div className="grid grid-cols-2 gap-7 mt-4">
                            <div className="col-span-1">
                                <div>
                                    Category
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div>
                                    Language
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 ">
                            Tagss
                        </div>
                    </div>
                </div>
                <div className="col-span-1 bg-orange relative">
                    IMG
                </div>
            </div>


        </>
    )
}