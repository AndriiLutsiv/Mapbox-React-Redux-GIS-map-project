interface IUser {
    username: string
    email: string
    companyUuid: string
    uuid: string
    isActive: boolean
    isSuperUser: boolean
    password?: string
  }

  type UserState = {
    users: IUser[]
    status: string
    error: string | null
  }
