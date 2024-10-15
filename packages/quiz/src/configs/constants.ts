export enum QuestionTypeEnum {
    MULTICHOICE = 0,
    SINGLECHOICE = 1,
    YESORNO = 2,
    FILLINBLANK = 3,
    RATING = 4,
    TEXT = 5,
    MATCHING = 6,
    INDICATEMISTAKE = 7,
    ESSAY = 8,
    FILLINBLANKALL = 20,// Hard FU
    FILLINBLANKGROUP = 21,// Hard FU,
    OTHER = -404,
}

export enum RemoveReasonsEnum {
    NOT_ENOUGH_ATTENDEND = "Không tham gia đủ số buổi học",
    NOT_PASS_TESTS = "Chưa qua các bài kiểm tra",
    DEPT_FEE = "Còn nợ học phí",
    DISCIPLINED = "Bị kỷ luật",
    BAD_ATTITUDE = "Thái độ, ý thức học tập trên lớp kém",
    OTHER = "Lý do khác",
}