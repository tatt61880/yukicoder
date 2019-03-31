//{{{
#include <bits/stdc++.h>
using namespace std;
//}}}

int main(){
	string A, B;
	cin >> A >> B;
	if(A == "0" && B == "0" || A == "2" && B == "2"){
		puts("E");
	}else if(A == "1" || A == "0" || B == "1" || B == "0"){
		puts("S");
	}else{
		puts("P");
	}
	return 0;
}
